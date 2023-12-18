export class LazyPool<T, U> {
  pool: T[] = []
  mapping = new Map<U, T>()
  constructor(
    public factory: (data: U) => T,
    public update: (data: U, target: T, index: number) => T = (data, target) => target,
    public comparator: (a: U, b: U) => boolean = (a, b) => a === b,
  ) {}
  from(arrayInput: U[]): T[] {
    const { pool, mapping } = this
    const newMapping = new Map<U, T>()
    const result: T[] = []

    for (const [index, item] of arrayInput.entries()) {
      let foundMatch = false
      for (const [key, value] of mapping) {
        if (this.comparator(item, key)) {
          result.push(this.update(item, value, index))
          newMapping.set(item, value)
          foundMatch = true
          break
        }
      }
      if (!foundMatch) {
        const tObject = pool.pop() ?? this.factory(item)
        result.push(this.update(item, tObject, index))
        newMapping.set(item, tObject)
      }
    }

    for (const [key, value] of mapping) {
      let stillExists = false
      for (const newItem of arrayInput) {
        if (this.comparator(key, newItem)) {
          stillExists = true
          break
        }
      }
      if (!stillExists) {
        pool.push(value)
      }
    }

    this.mapping = newMapping
    return result
  }
}
