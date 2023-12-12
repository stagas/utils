export class MapSet<K, V> {
  map = new Map<K, Set<V>>()

  constructor(mapSet?: MapSet<K, V>, shallow?: boolean) {
    if (mapSet) {
      if (shallow) {
        this.map = mapSet.map
      }
      else {
        this.map = new Map([...mapSet.map.entries()]
          .map(([key, set]) => [key, new Set(set)])
        )
      }
    }
  }

  copy() {
    return new MapSet(this)
  }

  shallowCopy() {
    return new MapSet(this, true)
  }

  add(key: K, value: V) {
    if (this.map.has(key)) {
      const set = this.map.get(key)!
      set.add(value)
      return set.size
    } else {
      this.map.set(key, new Set([value]))
      return 1
    }
  }

  create(key: K) {
    this.map.set(key, new Set())
  }

  keys() {
    return this.map.keys()
  }

  values() {
    return [...this.map.values()].flatMap((set) => [...set])
  }

  entries() {
    return [...this.map.entries()].flatMap(([key, set]) => [...set].map((v): [K, V] => [key, v]))
  }

  get(key: K) {
    return this.map.get(key)
  }

  sort(key: K, compareFn?: (a: V, b: V) => number) {
    const set = this.map.get(key)
    if (set) {
      const items = [...set].sort(compareFn)
      this.map.set(key, new Set(items))
    }
  }

  delete(key: K, value: any) {
    return this.map.get(key)?.delete(value) ?? false
  }

  has(key: K, value: any) {
    return this.map.get(key)?.has(value) ?? false
  }

  hasKey(key: K) {
    return this.map.has(key)
  }

  clear() {
    return this.map.clear()
  }

  get size() {
    return this.map.size
  }
}
