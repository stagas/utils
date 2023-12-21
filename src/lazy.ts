export class LazyAsyncMap<K, V> {
  map = new Map<K, Promise<V>>()
  constructor(private getter: (key: K, data?: any) => Promise<V>) { }
  get(key: K, data?: any) {
    if (this.map.has(key)) return this.map.get(key)!
    let promise: Promise<V>
    this.map.set(key, promise = this.getter(key, data))
    return promise
  }
}

export class LazyMap<K, V> {
  map = new Map<K, V>()
  constructor(private getter: (key: K, data?: any) => V) { }
  delete(key: K) {
    return this.map.delete(key)
  }
  values() {
    return this.map.values()
  }
  get(key: K, data?: any) {
    if (this.map.has(key)) return this.map.get(key)!
    let value: V
    this.map.set(key, value = this.getter(key, data))
    return value
  }
}
