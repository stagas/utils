export class LazyPool<T, U> {
  pool: T[] = []
  mapping = new Map<U, T>()
  constructor(
    public factory: (data: U) => T,
    public update: (data: U, target: T, index: number) => T = (data, target) => target,
    public comparator: (a: U, b: U) => boolean = (a, b) => a === b,
  ) {}
  from(arrayInput: U[]): T[] {
    const { pool, mapping, factory, update, comparator } = this
    const newMapping = new Map<U, T>()
    const result: T[] = []

    for (const [index, item] of arrayInput.entries()) {
      let foundMatch = false
      for (const [key, value] of mapping) {
        if (comparator(item, key)) {
          result.push(update(item, value, index))
          newMapping.set(item, value)
          foundMatch = true
          break
        }
      }
      if (!foundMatch) {
        const target = pool.pop() ?? factory(item)
        result.push(update(item, target, index))
        newMapping.set(item, target)
      }
    }

    for (const [key, value] of mapping) {
      let stillExists = false
      for (const newItem of arrayInput) {
        if (comparator(key, newItem)) {
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
