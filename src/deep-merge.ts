import { isArrayLike, isObject } from './is.ts'

export type DeepPartial<T> = { [K in keyof T]?:
  T[K] extends object
  ? DeepPartial<T[K]>
  : T[K]
}

export function deepMerge<T extends object>(
  dst: T,
  src: DeepPartial<T> | undefined,
  depth = Infinity,
  exclude?: (v: any) => boolean
): T {
  src ??= {} as T
  for (const key in src) {
    let value = src[key] as T[typeof key]
    let current = dst[key]
    if (
      isObject(value)
      && isObject(current)
      && !Array.isArray(current)
      && !exclude?.(value)
    ) {
      if (!depth) {
        dst[key] = value
      }
      else if (depth === 1) {
        Object.assign(current, value)
      }
      else {
        deepMerge(current, value, depth - 1, exclude)
      }
    }
    else {
      dst[key] = value
    }
  }
  return dst
}
