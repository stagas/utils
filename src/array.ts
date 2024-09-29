export function array<T>(
  cnt: number,
  of: (i: number) => T): T[] {
  return Array.from({ length: cnt }, (_, i) =>
    of(i)
  )
}

export function insert<T>(array: T[], index: number, ...items: T[]) {
  array.splice(index, 0, ...items)
  return array
}

export function remove<T>(array: T[], index: number) {
  array.splice(index, 1)
  return array
}
