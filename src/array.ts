export function array<T extends object>(
  cnt: number,
  of: (i: number) => T): T[] {
  return Array.from({ length: cnt }, (_, i) =>
    of(i)
  )
}
