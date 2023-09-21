export async function timeout(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
