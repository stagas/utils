export function findOrCreate<T>(
  array: T[], predicate: (item: T) => boolean, factory: () => T): T {
  let item = array.find(predicate)
  if (!item) {
    item = factory()
    array.push(item)
  }
  return item
}
