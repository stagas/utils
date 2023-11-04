export class TwoKeyMap<T, U> {
  map1 = new Map<T, Map<T, U>>()
  clear(): void {
    this.map1.clear()
  }
  delete(key1: T, key2: T): boolean {
    const map2 = this.map1.get(key1)
    let res = false
    if (map2) {
      res = map2.delete(key2)
      if (!map2.size) this.map1.delete(key1)
    }
    return res
  }
  // forEach(callbackfn: (value: U, key: T, map: Map<T, U>) => void, thisArg?: any): void {
  //   throw new Error('Method not implemented.')
  // }
  get(key1: T, key2: T): U | undefined {
    return this.map1.get(key1)?.get(key2)
  }
  has(key1: T, key2: T): boolean {
    return !!this.map1.get(key1)?.has(key2)
  }
  set(key1: T, key2: T, value: U) {
    let map2 = this.map1.get(key1)
    if (!map2) this.map1.set(key1, map2 = new Map<T, U>())
    map2.set(key2, value)
    return this
  }
  get size() {
    return this.map1.size
  }
  // entries(): IterableIterator<[T, U]> {
  //   throw new Error('Method not implemented.')
  // }
  // keys(): IterableIterator<T> {
  //   throw new Error('Method not implemented.')
  // }
  // values(): IterableIterator<U> {
  //   throw new Error('Method not implemented.')
  // }
  // [Symbol.iterator](): IterableIterator<[T, U]> {
  //   throw new Error('Method not implemented.')
  // }
  // [Symbol.toStringTag]: string

}
