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
export const memoize = <T>(
  fn: T & { apply(context: unknown, args: unknown[]): unknown },
  map = Object.create(null)
) => {
  const wrapped = function (this: unknown, ...args: unknown[]) {
    const serialized = args.join()
    return map[serialized] ?? (map[serialized] = fn.apply(this, args))
  }

  return wrapped as unknown as T
}

export default memoize
