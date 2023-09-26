import { nextPowerOfTwo } from './math.ts'

let pools: Map<number, any[][]>
let gcFreeArrays: Map<number, GcFreeArray<any>[]>

export class GcFreeArray<T> {
  static get(size: number) {
    gcFreeArrays ??= new Map()
    let pool = gcFreeArrays.get(size)
    if (!pool) gcFreeArrays.set(size, pool = [])
    if (pool.length) return pool.pop()!
    return new GcFreeArray(size)
  }

  data: T[]
  size = 0

  _head = 0
  _innerSize: number
  _innerMask: number

  constructor(beginSize: number) {
    this._innerSize = nextPowerOfTwo(beginSize)
    this._innerMask = this._innerSize - 1

    this.data = pools?.get(this._innerSize)?.pop()
      ?? Array.from({ length: this._innerSize })
  }
  _grow() {
    const newInnerSize = this._innerSize << 1
    const newData: T[] = pools?.get(newInnerSize)?.pop()
      ?? Array.from({ length: newInnerSize })
    for (let i = this._head, tail = this._head + this.size, x = 0, y;
      i < tail; i++, x++) {
      y = i & this._innerMask
      newData[x] = this.data[y]
    }
    this._disposeInnerData()
    this._head = 0
    this._innerSize = newInnerSize
    this._innerMask = this._innerSize - 1
    this.data = newData
  }
  dispose() {
    this.clear()
    gcFreeArrays ??= new Map()
    let pool = gcFreeArrays.get(this._innerSize)
    if (!pool) gcFreeArrays.set(this._innerSize, pool = [])
    pool.push(this)
  }
  _disposeInnerData() {
    pools ??= new Map()
    let pool = pools.get(this._innerSize)
    if (!pool) pools.set(this._innerSize, pool = [])
    pool.push(this.data)
  }
  copy(): GcFreeArray<T> {
    const newArray = GcFreeArray.get(this._innerSize)
    for (let i = this._head, tail = this._head + this.size; i < tail; i++) {
      newArray.push(this.data[i & this._innerMask])
    }
    return newArray
  }
  push(item: T) {
    if (this.size === this._innerSize) this._grow()
    this.data[(this._head + this.size) & this._innerMask] = item
    this.size++
  }
  pop(): T | undefined {
    if (!this.size) return
    --this.size
    return this.data[(this._head + this.size) & this._innerMask]
  }
  unshift(item: T) {
    if (this.size === this._innerSize) this._grow()
    this._head = (this._head + this._innerSize - 1) & this._innerMask
    this.data[this._head] = item
    this.size++
  }
  shift(): T | undefined {
    if (!this.size) return
    --this.size
    const item = this.data[this._head]
    this._head = (this._head + 1) & this._innerMask
    return item
  }
  delete(item: T) {
    if (!this.includes(item)) return

    const newData: T[] = pools?.get(this._innerSize)?.pop()
      ?? Array.from({ length: this._innerSize })

    let size = this.size
    for (let i = this._head, tail = this._head + this.size, x = 0, it; i < tail; i++) {
      it = this.data[i & this._innerMask]
      if (it === item) {
        --size
        continue
      }
      newData[x++] = it
    }

    this._disposeInnerData()
    this.data = newData
    this._head = 0
    this.size = size
  }
  forEach(fn: (item: T) => void) {
    for (let i = this._head, tail = this._head + this.size; i < tail; i++) {
      fn(this.data[i & this._innerMask])
    }
  }
  every(fn: (item: T) => boolean) {
    for (let i = this._head, tail = this._head + this.size; i < tail; i++) {
      if (!fn(this.data[i])) return false
    }
    return true
  }
  clear() {
    this._head = this.size = 0
  }
  includes(item: T) {
    const tail = this._head + this.size
    if (tail > this._innerSize) {
      if (this.data.indexOf(item, this._head) >= 0) return true
      const wrapIndex = tail & this._innerMask
      const index = this.data.indexOf(item)
      if (index >= 0 && index < wrapIndex) return true
    }
    else {
      const index = this.data.indexOf(item, this._head)
      if (index >= 0 && index < tail) return true
    }
    return false
  }
  *[Symbol.iterator]() {
    for (let i = this._head, tail = this._head + this.size; i < tail; i++) {
      yield this.data[i & this._innerMask]
    }
  }
}
