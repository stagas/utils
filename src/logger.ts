import { EventEmitter, ansiColorFor, checksum, colorHash } from './index.ts'
import { getFileId } from './get-file-id.ts'

// @ts-ignore
Symbol.dispose ||= Symbol.for('Symbol.dispose')
// @ts-ignore
Symbol.asyncDispose ||= Symbol.for('Symbol.asyncDispose')

export enum LogKind {
  Normal,
  Action,
  Branch,
  Entry,
  Queue,
  Stack,
}

export type Logger = Log & {
  action: Log
  branch: Log
  entry: Log
  queue: Log
  stack: Log
}

export type Log = {
  (label: string, ...args: any[]): void
  id(label: string, id: string, ...args: any[]): void
  push: Logger
  pop: Logger
  clearStack: () => void
}

function breaks(id: string, s: string) {
  return s

  if (s.toUpperCase().startsWith(id.toUpperCase() + '.')) {
    s = s.slice(id.length + 1)
  }
  let out = ''
  let start = 0
  let count = 0
  for (const x of s
    .replaceAll(/if\s*/gm, '')
    .replaceAll('!', 'NOT ')
    .replaceAll('&&', 'AND')
    .replaceAll('||', 'OR')
    .replaceAll(/[^a-z=?․]+/gmi, ' ')
    .split(' ')) {
    if (!x.length) continue
    const w = x + ' '
    count += w.length
    if (count > 10 && start > 1) {
      if (out.length && w.length) out += '\\n'
      start = 0
      count = 0
    }
    start += w.length
    out += w
  }
  out = out.trim()
  if (s.trim().startsWith('if')) {
    out += '?'
  }
  return out
}

export const loggerContext = {
  options: {
    quiet: false,
    prod: false
  },
  itemId: '',
  ids: new Set(),
  labels: new Map<string, any>(),
  arrows: new Set<string>(),
  ops: [] as any,
  stack: [] as string[],
  emitter: new EventEmitter<{
    event: (id: string, args: any[]) => void
  }>()
}

const c = loggerContext

class PopStackMismatchError extends Error {
  constructor(expected: string, actual: string | undefined, fn: any) {
    super(`Pop stack mismatch. Expected "${expected}" but found "${actual}" instead.`)
    this.name = 'PopStackMismatchError'
    // @ts-ignore
    Error.captureStackTrace(this, fn)
  }
}

class GetLineColError extends Error {
  constructor(origin: any) {
    super()
    this.name = 'GetLineColError'
    // @ts-ignore
    Error.captureStackTrace(this, origin)
  }
}

function getLineOrigin(origin: any) {
  const error = new GetLineColError(origin)
  let line: string | undefined
  const stack = error.stack!.split('\n').slice(1)
  while (line = stack.shift()) {
    if (line.trim().startsWith('at https')) {
      return stack.shift()!.split(' at ').pop()?.trim()
    }
    // if (!line.includes('logger')) return line.split('at').pop()?.trim()
  }
}

const reserved = new Set([
  'fill'
])
function fixReserved(x: string) {
  if (reserved.has(x.toLowerCase())) return '_' + x
  return x
}

function capitalFirst(x: string) {
  return x.charAt(0).toUpperCase() + x.slice(1)
}

function splitTag(label: string) {
  return label.split(':')
}
function cleanTag(label: string) {
  return splitTag(label)[0]
}

export function logger(path: string): Logger {
  const id = getFileId(path)

  c.ids.add(capitalFirst(id))

  const color = ansiColorFor(`[${id}]`)
  const digit = (checksum(id + id) % 100).toFixed(0).padStart(2, '0')
  const colored = (x: string) => `${color}${digit};${ansiColorFor(x)}${x}`

  const lastArrow = (label: string) => label.split(' -> ').pop()!
  const withId = (label: string) => {
    const a = capitalFirst(id)
    const b = fixReserved(lastArrow(label))
    return [a, b].filter(Boolean).join(`.`)
  }

  const log = (op: string, ...args: any[]) => {
    if (c.options.prod) return []
    return c.options.quiet ? [] : [[op, args]]
  }

  if (typeof location === 'undefined') {
    // @ts-ignore
    location = new URL('http://com/')
  }
  const searchParams = new URL(location.href).searchParams
  const filter =
    searchParams.get('filter')?.split(',')
    ?? searchParams.get('fi')?.split(',')
  const expand = searchParams.has('expand') || searchParams.has('ex')
  c.options.quiet ||= searchParams.has('qu')
  c.options.prod ||= searchParams.has('prod')
  if (c.options.prod) c.options.quiet = true

  const fn = Object.assign(log, {
    id: (id: string) => {
      c.itemId = id
      return wrapped
    },
    label: (label: string, asTop = false) => {
      return wrapped.push(label, asTop, false)
    },
    push: (label: string, isTop = false, isGroup = true) => {
      const [l, t] = splitTag(label)
      const tag = (t ? ':' + t : '')
      const lab = fixReserved(isTop ? l : withId(breaks(id, l)))

      if (filter) {
        if (!filter.some(x => lab.toLowerCase().includes(x))) {
          return []
        }
      }

      const path = '' //getLineOrigin(fn.push)
      if (lab.endsWith('?')) {
        c.labels.set(lab, { path, kind: LogKind[LogKind.Branch], color: colorHash(withId(cleanTag(label))) })
      }
      else if (l.trim().includes('run')) {
        c.labels.set(lab, { path, kind: LogKind[LogKind.Action], color: colorHash(withId(cleanTag(label))) })
      }
      else if (l.trim().includes('push')) {
        c.labels.set(lab, { path, kind: LogKind[LogKind.Queue], color: colorHash(withId(cleanTag(label))) })
      }
      else if (l.trim().includes('forEach')) {
        c.labels.set(lab, { path, kind: LogKind[LogKind.Stack], color: colorHash(withId(cleanTag(label))) })
      }
      else {
        c.labels.set(lab, { path, kind: LogKind[LogKind.Normal], color: colorHash(withId(cleanTag(label))) })
      }
      c.stack.push(lab)
      c.ops.push(c.stack.join(' -> ') + tag)
      c.arrows.add(c.stack.slice(-2).join(' -> ') + tag)
      if (!isGroup) c.stack.pop()
      return c.options.quiet ? [] : [
        [!isGroup ? 'info'
          : c.stack.length >= (expand ? 0 : 2)
            ? 'group' : 'groupCollapsed',
        [colored(withId(label))]
        ]
      ]
    },
    pop: (label: string, isTop = false) => {
      const top = c.stack.pop()
      c.ops.push(c.stack.join(' -> '))
      const lab = (isTop ? cleanTag(label) : withId(cleanTag(breaks(id, label))))
      if (top !== lab) {
        // console.warn(new PopStackMismatchError(lab, top, wrapped.pop))
      }
      return c.options.quiet ? [] : [['groupEnd', []]]
    },
    asTop: (payload: string) => {
      const [op, ...rest] = payload.split(' ')
      const text = rest.join(' ')
      return wrapped[op](text, true)
    },
    clearStack: () => {
      c.ops.splice(0)
      c.stack.splice(0)
    }
  })

  const wrapped = wrapAllEmitter(id, fn) as any

  wrapped['>'] = wrapped.push
  wrapped['<'] = wrapped.pop
  wrapped[':'] = wrapped.label
  wrapped['info'] = (label: string, ...args: any) => {
    const lab = withId(breaks(id, label))
    if (filter) {
      if (!filter.some(x => lab.toLowerCase().includes(x))) {
        return []
      }
    }
    return c.options.quiet ? [] : [['log', [colored(lab), ...args]]]
  }
  wrapped['->'] = wrapped.asTop

  return wrapped
}

function wrapAllEmitter<T>(id: string, obj: T): T {
  function wrap(fn: any): any {
    return Object.assign(function (this: any, ...args: any[]) {
      if (c.options.prod) return []

      c.emitter.emit('event', id, args)

      // if (c.options.quiet) return

      return fn.apply(this, args)
    }, {
      ...Object.fromEntries(Object.entries(fn).map(([key, value]) => {
        return [key, wrap(value)]
      }))
    })
  }

  return Object.assign(
    wrap(obj),
    Object.fromEntries(
      Object.entries(obj as any)
        .map(([key, value]) =>
          [key, typeof value === 'function'
            ? wrap(value)
            : value
          ]
        )
    )
  ) as any
}

declare const __filename: string

export function writeD2() {
  beforeEach(() => {
    c.stack.splice(0)
  })

  afterAll(async () => {
    const shapes = {
      Normal: 'rectangle',
      Action: 'oval',
      Branch: 'hexagon',
      Entry: 'circle',
      Queue: 'queue',
      Stack: 'cylinder',
    } as any

    const text = [
      ...[...loggerContext.ids].map(id =>
        `${id}.style.font-size: 60`
      ),
      ...[...loggerContext.arrows].map((x: any) =>
        x.includes('->') ? `${x} {
  style: {
    stroke-width: 8
    font-size: 35
    bold: true
    ${x.includes('ELSE IF') ? `
    stroke: "#f7c"
    font-color: "#f7c"
    ` : x.includes('IF') ? `
    stroke: "#7d4"
    font-color: "#7d4"
    ` : x.includes('ELSE') ? `
    stroke: "#f74"
    font-color: "#f74"
    ` : ''}
  }
}` : ''
      )
    ]

    for (const [key, value] of loggerContext.labels) {
      let link = ''
      if (value.path) {
        try {
          const path = await (globalThis as any)?.applySourceMaps?.(value.path)
          if (path) {
            const p = path.split(':')
            p.pop()
            p.push('0')
            link = `${key}: { link: ./${p.join(':').split('/').slice(-1).join('/')} }`
          }
        } catch (error) {
          console.log(error)
        }
      }
      text.push(`${key}: {
shape: ${shapes[value.kind]}
}

${key}.style.fill: "#${key.includes('ELSE IF')
          ? 'f7c'
          : key.includes('IF') ? '7d4'
            : key.includes('ELSE') ? 'f74'
              : value.color}"
${key}.style.font-color: "#000"
${key}.style.stroke-width: 4
${key}.style.stroke: "${(key.includes('IF') || key.includes('ELSE')) ? 'transparent' : '#000'}"
${key}.style.font-size: 40

${link}`)
    }


    ; (globalThis as any)?.writeTextFile?.(
      __filename.replace(/\.[jt]sx?$/, '.d2').replace('.test', ''),
      text.join('\n')
    )
  })
}
