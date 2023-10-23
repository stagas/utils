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
