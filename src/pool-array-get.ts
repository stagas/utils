export function poolArrayGet<T>(array: T[], index: number, factory: () => T): T {
  let r: T
  if (index >= array.length) {
    array.push(r = factory())
  }
  else {
    r = array[index]
  }
  return r
}
