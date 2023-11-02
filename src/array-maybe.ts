export function maybePush<T>(arr: T[], item: T): T[] {
  if (!arr.includes(item)) {
    arr.push(item)
  }
  return arr
}

export function maybeSplice<T>(arr: T[], item: T): T[] {
  const index = arr.indexOf(item)
  if (~index) {
    arr.splice(index, 1)
  }
  return arr
}

export function maybeSpliceFind<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
  const index = arr.findIndex(predicate)
  if (~index) {
    return arr.splice(index, 1)[0]
  }
}

export function insertSorted<T>(
  array: T[],
  item: T,
  compareFn: (a: T, b: T) => number
): T[] {
  let index = 0

  while (
    index < array.length
    && compareFn(array[index], item) < 0) {
    index++
  }

  array.splice(index, 0, item)

  return array
}
