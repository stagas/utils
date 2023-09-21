export function debounce<T extends (...args: any[]) => any>(ms: number, fn: T): T {
  let resolving = false

  let timeToResolve: number
  let now: number
  let delta: number
  let callThis: any
  let callArgs: any[]

  function resolver() {
    now = performance.now()
    delta = timeToResolve - now
    if (delta > 0) {
      setTimeout(resolver, delta)
    }
    else {
      fn.apply(callThis, callArgs)
      resolving = false
    }
  }

  function wrapper(this: any, ...args: any[]) {
    callThis = this
    callArgs = args
    timeToResolve = performance.now() + ms
    if (resolving) return
    resolving = true
    setTimeout(resolver, ms)
  }

  return wrapper as T
}
