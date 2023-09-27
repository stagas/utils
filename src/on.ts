import { Deferred } from './deferred.ts'
import { EventEmitter, EventEmitterEventKeys, EventEmitterEvents, EventEmitterOptions } from './event-emitter.ts'
import { assign } from './object.ts'
import * as String from './string.ts'
import { Fn, Get, Keys, Narrow, StringLiteral, StringOf } from './types.ts'

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

function onEvent<T extends EventEmitter<any>, K extends EventEmitterEventKeys<T>>(
  t: T,
  e: K,
  f: EventEmitterEvents<T>[K],
  options?: EventEmitterOptions
): Off
function onEvent<T extends EventTarget, K extends EventKeys<T>>(
  t: T,
  e: K,
  f: EventHandler<T, EventsOf<T>[K]>,
  options?: AddEventListenerOptions
): Off
function onEvent<T extends EventTarget | EventEmitter<any>>(
  t: T,
  e: any,
  f: any,
  options?: AddEventListenerOptions
): Off {
  if (t instanceof EventTarget) {
    t.addEventListener(e as any, f as any, options)
    return () => t.removeEventListener(e as any, f as any, options)
  }
  else if (t instanceof EventEmitter) {
    return t.on(e, f, options)
  }
  else {
    throw new TypeError('Cannot listen for events, object is neither an EventTarget nor an EventEmitter.')
  }
}

export const on = assign(onEvent, {
  once: function onEventOnce<T extends EventTarget, K extends EventKeys<T>>(
    t: T,
    e: K,
    f: EventHandler<T, EventsOf<T>[K]>,
    options?: AddEventListenerOptions
  ) {
    options = { ...options, once: true }

    const deferred = Deferred<EventsOf<T>[K]>()

    const inner: any = function (this: any, e: any) {
      const retValue = f.call(this, e)
      deferred.resolve(e)
      return retValue
    }

    t.addEventListener(e as any, inner, options)

    return Object.assign(
      () => t.removeEventListener(e as any, inner, options),
      {
        then: deferred.promise.then.bind(deferred.promise),
        catch: deferred.promise.catch.bind(deferred.promise),
      }
    )
  }
})
