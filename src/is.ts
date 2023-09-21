export function isObject<T>(v: T): v is T & object {
  return typeof v === 'object' && v !== null
}

export function isArrayLike<T extends object>(v: T): v is T & { length: unknown } {
  return 'length' in v
}
