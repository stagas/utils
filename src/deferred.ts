export interface Deferred<T> {
  hasSettled: boolean
  promise: Promise<T>
  when: (fn: () => void) => void
  resolve: (value: T) => void
  reject: (error?: Error) => void
  value?: T
  error?: Error | undefined
}

export function Deferred<T>() {
  const _onwhen = () => {
    deferred.hasSettled = true
    deferred.resolve = deferred.reject = noop
  }

  const noop = () => { }

  let onwhen = _onwhen

  const deferred = {
    hasSettled: false,
    when: fn => {
      onwhen = () => {
        _onwhen()
        fn()
      }
    },
  } as Deferred<T>

  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = arg => {
      onwhen()
      deferred.value = arg
      resolve(arg)
    }
    deferred.reject = error => {
      onwhen()
      deferred.error = error
      reject(error)
    }
  })

  return deferred
}
