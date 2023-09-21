import * as String from './string'
import { Fn, Get, Keys, Narrow, StringLiteral, StringOf } from './types'

export type SansOn<T> = String.Split<StringOf<T>, ' on'>
export type EventKeys<T> = keyof EventsOf<T>
export type EventsOf<T> = {
  [
  K in Keys<T> as NonNullable<T[K]> extends Fn<any, any>
  ? String.At<StringOf<K>, 0> extends StringLiteral<'o'>
  ? String.At<StringOf<K>, 1> extends StringLiteral<'n'> ? SansOn<` ${StringOf<K>}`>[1] : never
  : never
  : never
  ]-?: Narrow<
    Parameters<
      Narrow<
        Get<
          T,
          K
        >,
        Fn<any, any>
      >
    >[0],
    Event
  >
}

export type Off = () => void

export interface EventHandler<T, E> {
  (this: T, event: E & { currentTarget?: T; target?: Element }): any
}

export function on<T extends EventTarget, K extends EventKeys<T>>(
  t: T,
  e: K,
  f: EventHandler<T, EventsOf<T>[K]>,
  options?: AddEventListenerOptions
) {
  t.addEventListener(e as any, f as any, options)
  return () => t.removeEventListener(e as any, f as any, options)
}

// const off = on(window, 'contextmenu', (e) => {

// })
