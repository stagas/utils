export function filterAs<T>(arr: T[]) {
  return function<U>(predicate: (item: T) => any): U[] {
    return arr.filter(predicate) as unknown as U[]
  }
}
