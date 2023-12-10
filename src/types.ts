export type Ctor<T extends object = any> = { new(...args: any[]): T }
export type Narrow<K, T> = K extends T ? K : never
export type NarrowKey<K, T> = Narrow<K, keyof T>
export type Get<T, K> = T[NarrowKey<K, T>]
export type StringOf<T> = Narrow<T, string>
export type ValuesOf<T> = T[keyof T]
export type Fn<T extends unknown[], R> = (...args: T) => R
export type StringLiteral<T> = T extends string ? string extends T ? never : T : never
export type StringKeys<T> = StringOf<keyof T>
export type Keys<T> = keyof { [K in keyof T]: StringOf<K> }
export type Key = number | string | symbol
export type ObjectFromList<T extends ReadonlyArray<Key>, V = Key> = {
  [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
}
export type Null = null | undefined | void
export type ExcludeNull<T> = {
  [K in Keys<T> as T[K] extends Null ? never : K]: T[K]
}
export type NonNull<T> = {
  [P in keyof T]-?: T[P] & {}
}
export type EventTargets<T> = {
  [K in keyof T]: T[K] extends EventTarget ? T[K] : never
}
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}
export type PointerLikeEvent = Mutable<Partial<Event>>
  & Mutable<
    & (
      | ({ type: 'wheel' } & Pick<WheelEvent, 'deltaX' | 'deltaY'>)
      | ({
        type:
        | 'mousemove'
        | 'mousedown'
        | 'mouseup'
        | 'mouseleave'
      } & Pick<MouseEvent, 'button' | 'buttons'>)
      | ({
        type:
        | 'pointermove'
        | 'pointerdown'
        | 'pointerup'
        | 'pointerleave'
        | 'pointercancel'
      } & Pick<PointerEvent, 'button' | 'buttons'>)
      | ({
        type: 'contextmenu'
      })
    )
    & (
      Pick<PointerEvent,
        | 'pageX'
        | 'pageY'
      >
    )
    & (
      Partial<Pick<PointerEvent,
        | 'altKey'
        | 'ctrlKey'
        | 'metaKey'
        | 'shiftKey'
      >>
    )

  >

// Mutable<
//   Partial<Event>
//   & Partial<
//     Pick<MouseEvent & PointerEvent & WheelEvent,
//       | 'deltaX'
//       | 'deltaY'
//       | 'buttons'
//     >
//   >
//   & Required<
//     Pick<MouseEvent & PointerEvent & WheelEvent,
//       | 'type'
//       | 'pageX'
//       | 'pageY'
//     >
//   >
// >
export type PointLike = { x: number, y: number }
export type Promised<T, U extends unknown[] = unknown[]> = (...args: U) => Promise<T>
