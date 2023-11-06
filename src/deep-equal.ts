import { DeepPartial } from './deep-merge.ts'
import { isArrayLike, isObject } from './is.ts'

export function deepEqual<T>(
  dst: T,
  src: DeepPartial<T> | undefined,
): boolean {
  src ??= {} as T
  if (src === dst) return true
  let pass = false
  for (const key in src) {
    let value = src[key] as T[typeof key]
    let current = dst[key]
    if (
      isObject(value)
      && isObject(current)
      && !isArrayLike(current)
    ) {
      const res = deepEqual(current, value)
      if (res) return true
    }
    else {
      const res = value === current
      if (res) return true
    }
  }
  return pass
}
