export async function ticks(n: number) {
  while (n--) {
    await Promise.resolve()
  }
}
