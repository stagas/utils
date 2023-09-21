const { assign, entries, values } = Object
export { assign, entries, values }

export function keys<K extends keyof T,
  T extends { [s: string]: any }>(obj: T): K[]
export function keys<K extends keyof T,
  T extends ArrayLike<any>>(obj: T): K[]
export function keys<K extends keyof T,
  T extends { [s: string]: any } | ArrayLike<any>>(obj: T): K[] {
  return Object.keys(obj) as unknown as K[]
}
