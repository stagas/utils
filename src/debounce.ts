interface DebounceOptions {
  first?: boolean
  last?: boolean
}
export function debounce<T extends (...args: any[]) => any>(ms: number, fn: T, options?: DebounceOptions): T {
  let resolving = false

  let timeToResolve: number
  let now: number
  let delta: number
  let callThis: any
  let callArgs: any

  function resolver() {
    now = performance.now()
    delta = timeToResolve - now
    if (delta > 5) {
      setTimeout(resolver, delta)
    }
    else if (callArgs) {
      fn.apply(callThis, callArgs)
      resolving = false
    }
  }

  function wrapper(this: any, ...args: any[]) {
    callThis = this
    callArgs = args
    timeToResolve = performance.now() + ms
    if (resolving) return
    if (options?.first) {
      fn.apply(callThis, callArgs)
      if (!options.last) {
        callArgs = void 0
      }
    }
    resolving = true
    setTimeout(resolver, ms)
  }

  return wrapper as T
}

export function debounces(ms: number, options?: DebounceOptions) {
  return function __debounces__(t: any, k: any, d: PropertyDescriptor) {
    d.value = debounce(ms, d.value, options)
    return d
  }
}

export async function test_debounce() {
  // @env browser

  describe('debounce', () => {
    it('works', async () => {
      let a = 0
      const fn = debounce(50, () => {
        a++
      })

      fn()
      fn()
      fn()
      await new Promise(resolve => setTimeout(resolve, 10))
      fn()
      fn()
      fn()
      fn()
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(a).toEqual(1)

      fn()
      fn()
      fn()
      await new Promise(resolve => setTimeout(resolve, 10))
      fn()
      fn()
      fn()
      fn()
      expect(a).toEqual(1)
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(a).toEqual(2)
    })
  })
}
