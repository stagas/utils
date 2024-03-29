import { Deferred } from './deferred.ts'

/**
 * Memoize a function.
 *
 * ```ts
 * const fn = memoize((a, b, c) => some_expensive_calls(a, b, c))
 * ...
 * const result = fn(1, 2, 3) // => calls the inner function and saves arguments signature "1,2,3"
 * ...
 * const result = fn(1, 2, 3) // => returns the memoized result immediately since "1,2,3" matches memory
 * ```
 *
 * @param fn The function to memoize
 * @param map A map object to use as memory
 * @returns The memoized function
 */
type FnManyArgs = (...args: any[]) => any
export function memoize<T>(fn: T & FnManyArgs, map = Object.create(null)): T {
  function wrapped(this: any, ...args: any[]) {
    const serialized = args.join()
    return map[serialized] ?? (map[serialized] = fn.apply(this, args))
  }
  return wrapped as T
}

type FnOneArg = (arg: any, ...args: any[]) => any
export function memoizeByRef<T>(fn: T & FnOneArg, map = new Map()): T {
  function wrapped(this: any, arg: any, ...args: any[]) {
    if (map.has(arg)) return map.get(arg)
    let res
    map.set(arg, res = fn.call(this, arg, ...args))
    return res
  }
  return wrapped as T
}

export function memoizeAsync<T, U extends unknown[], V extends unknown>(fn: (this: V, ...args: U) => Promise<T>) {
  let deferred: Deferred<T>
  return async function memoizeAsyncInner(this: V, ...args: U) {
    if (deferred) return deferred.promise
    deferred = Deferred()
    const result = await fn.apply(this, args)
    queueMicrotask(() => {
      deferred.resolve(result)
    })
    return result
  }
}
