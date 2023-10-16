export async function bench(label: string, times: number, its: number, fn: any, reset?: any) {
  for (let t = 0; t < times; t++) {
    const start = performance.now()
    for (let i = 0; i < its; i++) {
      fn()
    }
    const total = performance.now() - start
    console.log(
      '%s: total: %f, speed: %f/s, %f/frame ',
      label,
      total,
      1000 / (total / its),
      (1000 / (total / its)) / 60
    )
    reset?.()
    await Promise.resolve()
  }
}
