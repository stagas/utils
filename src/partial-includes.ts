export function partialIncludes<T>(arr: T[], endIndex: number, item: T): boolean {
  for (let i = 0; i < endIndex; i++) {
    if (arr[i] === item) return true
  }
  return false
}
