export function poolArrayGet<T>(items: T[], i: number, factory: () => T): T {
  let r: T
  if (i >= items.length) {
    items.push(r = factory())
  }
  else {
    r = items[i]
  }
  return r
}
