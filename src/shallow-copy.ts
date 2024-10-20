export function shallowCopy<T extends Record<string, any>>(obj: T): T {
  return { ...obj }
}
