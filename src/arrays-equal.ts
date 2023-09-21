export function arraysEqual<T extends unknown[]>(
  a: T,
  b: T | undefined,
  predicate: (a: T[0], b: T[0]) => boolean = (a, b) => a === b
) {
  if (!b) return false
  if (a.length !== b.length) return false
  return a.every((x, i) => predicate(x, b[i]))
}
