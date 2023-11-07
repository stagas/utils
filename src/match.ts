import { deepEqual } from './deep-equal.ts'

export function match<T, U, V extends M[], M extends T>(
  category: string,
  obj: T,
  cases: [matchers: V, then: (obj: T) => U][],
  debug?: (category: string, matcher: M | undefined, result: U, obj: T) => void
) {
  if (debug) {
    for (const [matchers, then] of cases) {
      if (!matchers.length) {
        const result = then(obj)
        debug(category, void 0, result, obj)
        if (result) return result
      }
      else for (const matcher of matchers) {
        if (deepEqual(obj, matcher)) {
          const result = then(obj)
          debug(category, matcher, result, obj)
          if (result) return result
        }
      }
    }
  }
  else for (const [matchers, then] of cases) {
    if (!matchers.length) {
      const result = then(obj)
      if (result) return result
    }
    else for (const matcher of matchers) {
      if (deepEqual(obj, matcher)) {
        const result = then(obj)
        if (result) return result
      }
    }
  }
}
