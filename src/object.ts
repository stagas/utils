import { memoizeByRef } from './memoize'
import { StringKeys } from './types'

const { values, getPrototypeOf, getOwnPropertyDescriptor, getOwnPropertyDescriptors } = Object
export { values }

export function assign<T extends {}>(o: T, p1: Partial<T>, p2: Partial<T>, p3: Partial<T>, p4: Partial<T>): T
export function assign<T extends {}>(o: T, p1: Partial<T>, p2: Partial<T>, p3: Partial<T>): T
export function assign<T extends {}>(o: T, p1: Partial<T>, p2: Partial<T>): T
export function assign<T extends {}>(o: T, p: Partial<T>): T
export function assign<T extends {}>(o: T, ...p: Partial<T>[]): T {
  return Object.assign(o, ...p)
}
export function keys<K extends keyof T,
  T extends { [s: string]: any }>(obj: T): K[]
export function keys<K extends keyof T,
  T extends ArrayLike<any>>(obj: T): K[]
export function keys<K extends keyof T,
  T extends { [s: string]: any } | ArrayLike<any>>(obj: T): K[] {
  return Object.keys(obj) as unknown as K[]
}

export function entries<
  K extends StringKeys<T>,
  V extends T[K],
  T extends { [s: string]: any }
>(obj: T): readonly [K, V][]
export function entries<
  K extends StringKeys<T>,
  V extends T[K],
  T extends ArrayLike<any>
>(obj: T): readonly [K, V][]
export function entries<
  K extends StringKeys<T>,
  V extends T[K],
  T extends { [s: string]: any } | ArrayLike<any>
>(obj: T): readonly [K, V][] {
  return Object.entries(obj) as unknown as readonly [K, V][]
}

export function fromEntries<K extends string, V, T>(entries: [K, V][]): { [key in K]: V } {
  return Object.fromEntries(entries) as Record<K, V>
}

const emptyObject = { __proto__: null } as {}

// https://github.com/thefrontside/microstates/blob/master/packages/microstates/src/reflection.js
export function getAllPropertyDescriptors(object: object): PropertyDescriptorMap {
  if (object === Object.prototype) {
    return emptyObject
  }
  else {
    return Object.assign(
      // @ts-ignore
      { __proto__: null, },
      getAllPropertyDescriptorsMemoized(getPrototypeOf(object)),
      getOwnPropertyDescriptors(object)
    )
  }
}

export const getAllPropertyDescriptorsMemoized = memoizeByRef(getAllPropertyDescriptors)

export function getPropertyDescriptor(object: object, key: string): PropertyDescriptor | undefined {
  if (object === Object.prototype) {
    return
  }
  else {
    const desc = getOwnPropertyDescriptor(object, key)
    if (!desc) return getPropertyDescriptor(getPrototypeOf(object), key)
    return desc
  }
}
