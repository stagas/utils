export type Narrow<K, T> = K extends T ? K : never
export type NarrowKey<K, T> = Narrow<K, keyof T>
export type Get<T, K> = T[NarrowKey<K, T>]
export type StringOf<T> = Narrow<T, string>
export type Fn<T extends unknown[], R> = (...args: T) => R
export type StringLiteral<T> = T extends string ? string extends T ? never : T : never
export type Keys<T> = keyof { [K in keyof T]: StringOf<K> }
export type Key = number | string | symbol
export type ObjectFromList<T extends ReadonlyArray<Key>, V = Key> = {
  [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
}
export type Null = null | undefined | void
export type NonNull<T> = {
  [K in Keys<T> as T[K] extends Null ? never : K]: T[K]
}
