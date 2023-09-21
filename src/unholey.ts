/**
 * Puts `undefined` into the holes so `.every`/`.some`/etc. can work.
 */
export function unholey<T extends unknown[]>(arr: T): T {
  for (let i = 0; i < arr.length; i++) {
    if (!(i in arr)) arr[i] = void 0
  }
  return arr
}
