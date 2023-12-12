export function splitAt(string: string, index: number) {
  return [string.slice(0, index), string.slice(index + 1)] as const
}
