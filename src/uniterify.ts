export function uniterify<T, U>(fn: AsyncIterableIterator<U>, it: (v: U) => T) {
  return async function* () {
    for await (const v of fn) {
      yield it(v as U)
    }
  }
}
