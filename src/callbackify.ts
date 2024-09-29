import { consumify } from './consumify.ts'
import { Deferred } from './deferred.ts'

export function callbackify<T>(fn: () => AsyncIterableIterator<T>, cb: (v: T) => void) {
  const deferred = Deferred<void>()
  const res = consumify(fn(), cb)
  res.then(deferred.resolve).catch(deferred.reject)
  return deferred
}
