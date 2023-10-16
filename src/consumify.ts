export async function consumify<T, U>(gen: AsyncIterableIterator<T>, cb: (v: T) => U) {
  for await (const v of gen) {
    cb(v)
  }
}
