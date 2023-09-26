export function traverseCollect<
  T,
  K extends keyof T,
>(root: T, key: K): NonNullable<T[K]> {
  const results: any[] = []
  const queue: any[] = [...(root as any)[key]]
  while (queue.length) {
    const item = queue.shift()!
    results.push(item)
    if (key in item && Array.isArray(item[key])) {
      queue.push(...(item as any)[key])
    }
  }
  return results.reverse() as any
}
