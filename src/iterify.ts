import { Deferred } from './deferred'

export interface IterifyOptions {
  unsafeInitial?: boolean
}
type Callback<T> = (arg: T) => void
type Off = (() => void) | void
export function iterify<T>(fn: (cb: Callback<T>) => Off, options?: IterifyOptions) {
  const deferreds: Deferred<T>[] = []
  const queued: T[] = []
  const cb = (arg: T) => {
    if (deferreds.length) {
      const d = deferreds.shift()!
      if (arg instanceof Error) d.reject(arg)
      else d.resolve(arg)
    }
    else queued.push(arg)
  }
  const off = fn(cb)
  const dispose = () => {
    off?.()

    // TODO: might not be the right approach here.
    const disposed = new Error('Disposed.')
    let d: Deferred<T> | undefined
    while (d = deferreds.shift()) {
      d.reject(disposed)
    }
  }
  if (options?.unsafeInitial && !queued.length) {
    (cb as any)()
  }
  return {
    dispose,
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          if (queued.length) {
            const arg = queued.shift()
            if (arg instanceof Error) yield Promise.reject(arg)
            else yield Promise.resolve(arg)
          }
          else {
            const deferred = Deferred<T>()
            deferreds.push(deferred)
            yield deferred.promise
          }
        }
      }
      catch (error) {
        throw error
      }
      finally {
        dispose()
      }
    }
  }
}
