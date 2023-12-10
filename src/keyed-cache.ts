import { Deferred } from './deferred.ts'

export function KeyedCache<T, U extends unknown[], V extends string | number>(getter: (key: V, ...args: U) => Promise<T>, maxCacheSize = Infinity) {
  const cache = new Map<V, { deferred: Deferred<T>, accessTime: number }>()

  let accessTime = 0

  const get = Object.assign(async function (key: V, ...args: U): Promise<T> {
    let cacheItem = cache.get(key)

    if (cacheItem == null) {
      const deferred = Deferred<T>()

      accessTime++

      cache.set(key, cacheItem = { deferred, accessTime })

      getter(key, ...args)
        .then(deferred.resolve)
        .catch(deferred.reject)
    }
    else {
      cacheItem.accessTime = accessTime++

      if (cache.size > get.maxCacheSize) {
        const [lruKey] = [...cache].sort(([, a], [, b]) => a.accessTime - b.accessTime)[0]

        cache.delete(lruKey)
      }
    }

    return cacheItem.deferred.promise
  }, {
    cache,
    maxCacheSize
  })

  return get
}
