export function findOrCreate<T>(
  array: T[],
  predicate: (item: T) => boolean,
  factory: () => T,
  update: (item: T) => T = item => item
): T {
  let item = array.find(predicate)
  if (!item) {
    item = update(factory())
    array.push(item)
  }
  return update(item)
}
