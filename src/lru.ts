export function Lru<T, U extends any[], V extends any>(
  max: number,
  fn: (key: V, ...args: U) => T,
  clear: (item: T) => void,
  free: (item: T) => void
) {
  let items = new Map<V, T>()
  return (key: V, ...args: U) => {
    let item = items.get(key)
    if (!item) {
      while (items.size >= max) {
        const [first, ...rest] = items
        const [, value] = first
        free(value)
        items = new Map(rest)
      }
      items.set(key, item = fn(key, ...args))
    }
    else {
      clear(item)

      // move to last
      items.delete(key)
      items.set(key, item)
    }
    return item
  }
}
