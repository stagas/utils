/**
const schema = [[Literal, [
  '_id',
  '_rev',
  'name',
  'homepage',
  ['versions', ['*', [
    'name',
    'gitHead',
    ['os', [Literal]],
    ['cpu', [Literal]],
    ['engines', ['*']],
    ['dist', [
      'shasum',
      'tarball',
      'unpackedSize',
    ]],
    ['dependencies', [
      '*',
    ]],
  ]]],

  ['time', ['*']],
]]]

await fsp.writeFile(
  options.packumentCachePath,
  stringify(schema, [...packumentCache]),
  'utf-8'
)

json = parse(schema, await fsp.readFile(options.packumentCachePath, 'utf-8'))

*/
export namespace FastJson {
  export const Literal = Symbol()

  const OPEN = '\x01\n'
  const CLOSE = '\x02\n'
  const CLOSE_1 = '\x02'

  export function stringify(schema: any, input: any): string {
    let s = ''
    let i: number, k: any, key: any

    if (schema.length === 1) {
      if (typeof (key = schema[0]) === 'object') {
        if (input?.length) {
          for (i = 0; i < input.length; i++) {
            s += OPEN + stringify(key, input[i])
          }
        }
        s += CLOSE
        return s
      } else if (key === Literal) {
        if (input?.length)
          for (i = 0; i < input.length; i++) {
            s += input[i] + '\n'
          }
        s += CLOSE
        return s
      }
    }

    if (schema.length > 1 && schema.every((x: any) => typeof x !== 'string')) {
      for (i = 0; i < schema.length; i++) {
        key = schema[i]
        if (key === Literal) {
          s += input[i] + '\n'
        } else {
          s += stringify(key, input[i])
        }
      }
      return s
    }

    for (i = 0; i < schema.length; i++) {
      key = schema[i]
      if (typeof key === 'object') {
        s += stringify(key[1], input[key[0]])
      } else if (key === '*') {
        if (++i < schema.length) {
          key = schema[i]
          for (const k in input) {
            s += k + '\n' + stringify(key, input[k])
          }
          s += CLOSE
        } else {
          for (k in input) {
            s += `${k},${input[k]}` + '\n'
          }
          s += CLOSE
        }
      } else {
        s += (input[key] ?? '') + '\n'
      }
    }

    return s
  }

  export function parse(schema: any, input: string) {
    return parseLines(schema, Object.assign(input.split('\n'), { index: 0 }))
  }

  export function parseLines(schema: any, input: string[] & { index: number }): any {
    let key: any, out: any

    if (schema.length === 1) {
      if (typeof (key = schema[0]) === 'object') {
        out = []
        for (; input.index < input.length;) {
          if (input[input.index++] === CLOSE_1) break
          out.push(parseLines(key, input))
        }
        return out
      } else if (key === Literal) {
        out = []
        for (let item; input.index < input.length;) {
          item = input[input.index++]
          if (item === CLOSE_1) break
          out.push(item)
        }
        return out
      }
    }

    if (schema.length > 1 && schema.every((x: any) => typeof x !== 'string')) {
      out = Array.from({ length: schema.length })
      for (let key, i = 0; i < schema.length; i++) {
        key = schema[i]
        if (key === Literal) {
          out[i] = input[input.index++]
        } else {
          out[i] = parseLines(key, input)
        }
      }
      return out
    }

    out = {}
    for (let key, line, i = 0; i < schema.length; i++) {
      key = schema[i]
      if (typeof key === 'object') {
        out[key[0]] = parseLines(key[1], input)
      } else if (key === '*') {
        if (++i < schema.length) {
          key = schema[i]
          for (let k; input.index < input.length;) {
            k = input[input.index++]
            if (k === CLOSE_1) break
            out[k] = parseLines(key, input)
          }
        } else {
          for (let kv; input.index < input.length;) {
            kv = input[input.index++]
            if (kv === CLOSE_1) break
            const comma = kv.indexOf(',')
            out[kv.slice(0, comma)] = kv.slice(comma + 1)
          }
        }
      } else {
        line = input[input.index++]
        out[key] = line != '' ? line : void 0
      }
    }
    return out
  }
}
