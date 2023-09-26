const { entries, values } = Object
export { entries, values }

export function assign<T extends {}>(o: T, p: Partial<T>): T {
  return Object.assign(o, p)
}
export function keys<K extends keyof T,
  T extends { [s: string]: any }>(obj: T): K[]
export function keys<K extends keyof T,
  T extends ArrayLike<any>>(obj: T): K[]
export function keys<K extends keyof T,
  T extends { [s: string]: any } | ArrayLike<any>>(obj: T): K[] {
  return Object.keys(obj) as unknown as K[]
}
