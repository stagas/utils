import { deepEqual } from './deep-equal.ts'

export function match<T, U, V extends object>(
  category: string,
  obj: T,
  cases: [matcher: V, then: (obj: T) => U][],
  debug?: (category: string, matcher: V, result: U, obj: T) => void
) {
  if (debug) {
    for (const [matcher, then] of cases) {
      if (deepEqual(obj, matcher)) {
        const result = then(obj)
        debug(category, matcher, result, obj)
        return result
      }
    }
  }
  else for (const [matcher, then] of cases) {
    if (deepEqual(obj, matcher)) {
      return then(obj)
    }
  }
}
