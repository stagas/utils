export function mutable<T>(array: readonly T[]) {
  return array as T[]
}
