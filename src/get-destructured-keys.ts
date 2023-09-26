type Fn = ((...args: any[]) => any) & { keys?: string[]; keys2?: [a: string[], b: string[]] }

const junk = /`((\\`)?[^`])+?`|'((\\')?[^'])+?'|"((\\")?[^"])+?"|\([^{[(]*?\)|\{[^{[(]*?\}|\[[^{[(]*?\]/g
const words = /[^\w\s$]+/g

let match
const replacer = () => {
  match = true
  return ''
}

const parse = (d: number, x: string) => {
  x = x.slice(d)

  do {
    match = false
    x = x.replace(junk, replacer)
  } while (match)

  return x.split('}')[0]
    .split(',')
    .map((x) => x.split(words)[0].trim())
    .filter(Boolean)
}

export function getDestructuredKeys<T extends string>(fn: Fn) {
  if (fn.keys) return fn.keys

  let x = fn.toString()
  const d = x.indexOf('{') + 1

  if (!d || x.slice(0, d).includes(')')) {
    fn.keys = []
  }
  else {
    fn.keys = parse(d, x)
  }

  return fn.keys
}

export function getDestructuredKeysTwo<T extends string>(fn: Fn) {
  if (fn.keys2) return fn.keys2

  let x = fn.toString()
  let y = x.slice(0, x.indexOf(')'))

  const d = x.indexOf('{') + 1
  const d2 = x.indexOf('{', d) + 1

  let a: string[]
  let b: string[]

  if (!d || x.slice(0, d).includes(')')) {
    fn.keys2 = [[], []]
  }
  else {
    a = parse(d, x)
    b = parse(d2, y)
    fn.keys2 = [a, b]
  }

  return fn.keys2
}

export function test_getDestructuredKeys() {
  // @env browser
  describe('one', () => {
    it('works', () => {
      function foo({ a, b }: any) {
      }
      const a = getDestructuredKeys(foo)
      expect(a).toEqual(['a', 'b'])

      function bar({ c, d }: any) {
      }
      const b = getDestructuredKeys(bar)
      expect(b).toEqual(['c', 'd'])
    })
  })

  describe('two', () => {
    it('works', () => {
      function foo({ a, b }: any, { c, d }: any) {
      }
      const [a, b] = getDestructuredKeysTwo(foo)
      expect(a).toEqual(['a', 'b'])
      expect(b).toEqual(['c', 'd'])
    })

    it('given one', () => {
      function foo({ a, b }: any) {
        const rest = { c: a, d: b }
      }
      const [a, b] = getDestructuredKeysTwo(foo)
      expect(a).toEqual(['a', 'b'])
      expect(b).toEqual([])
    })
  })
}
