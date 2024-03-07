export function Lru<T>(
  max: number,
  fn: (length: number) => T,
  clear: (item: T) => void,
  free: (item: T) => void
) {
  let items = new Map<number, T>()
  return (length: number) => {
    let item = items.get(length)
    if (!item) {
      while (items.size >= max) {
        const [first, ...rest] = items
        const [, value] = first
        free(value)
        items = new Map(rest)
      }
      items.set(length, item = fn(length))
    }
    else {
      clear(item)

      // move to last
      items.delete(length)
      items.set(length, item)
    }
    return item
  }
}
