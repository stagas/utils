export function throttle<T extends (...args: any[]) => any>(ms: number, fn: T): T {
  let isRunning = false
  let lastArgs: any[] | null = null

  const throttled = (...args: any[]) => {
    if (isRunning) {
      lastArgs = args
      return
    }

    fn(...args)

    isRunning = true

    setTimeout(() => {
      isRunning = false
      if (lastArgs) {
        fn(...lastArgs)
        lastArgs = null
      }
    }, ms)
  }

  return throttled as T
}
