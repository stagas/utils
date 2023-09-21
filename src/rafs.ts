export async function rafs(n: number = 1) {
  while (n--) {
    await new Promise(requestAnimationFrame)
  }
}
