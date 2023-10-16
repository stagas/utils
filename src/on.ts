import { Deferred } from './deferred.ts'
import { EventEmitter, EventEmitterEventKeys, EventEmitterEvents, EventEmitterOptions } from './event-emitter.ts'
import { iterify } from './iterify.ts'
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

export interface EventHandler<T, E, K> {
  (this: T, event: E & { type: K, currentTarget?: T; target?: Element }): any
}

export interface OnEventEmitterOptions extends EventEmitterOptions {
  unsafeInitial?: boolean
}

function onEvent<T extends EventEmitter<any>, K extends EventEmitterEventKeys<T>>(
  t: T,
  e: K,
  f: EventEmitterEvents<T>[K],
  options?: OnEventEmitterOptions
): Off
function onEvent<T extends EventTarget, K extends EventKeys<T>>(
  t: T,
  e: K,
  f: EventHandler<T, EventsOf<T>[K], K>,
  options?: OnEventOptions
): Off
function onEvent<T extends EventTarget, K extends EventKeys<T>>(
  t: T,
  e: K,
  options?: OnEventOptions
): AsyncIterableIterator<EventsOf<T>[K]>
function onEvent<T extends EventTarget | EventEmitter<any>>(
  t: T,
  e: any,
  f?: any,
  options?: OnEventOptions
): any {
  if (!f || typeof f === 'object') {
    return iterify(cb => onEvent(t as any, e, cb, f))
  }
  if (t instanceof EventTarget) {
    t.addEventListener(e as any, f as any, options)
    if (options?.unsafeInitial) {
      f()
    }
    return () => t.removeEventListener(e as any, f as any, options)
  }
  else if (t instanceof EventEmitter) {
    if (options?.unsafeInitial) {
      f()
    }
    return t.on(e, f, options)
  }
  else {
    throw new TypeError('Cannot listen for events, object is neither an EventTarget nor an EventEmitter.')
  }
}

export interface OnEventOptions extends AddEventListenerOptions {
  unsafeInitial?: boolean
}

export type OnceReturn<T extends EventTarget, K extends EventKeys<T>> =
  Off & {
    then: Promise<EventsOf<T>[K]>['then']
    catch: Promise<EventsOf<T>[K]>['catch']
  }

export type OnceReturnEE<T extends EventEmitter<any>, K extends EventEmitterEventKeys<T>> =
  Off & {
    then: Promise<EventEmitterEvents<T>[K]>['then']
    catch: Promise<EventEmitterEvents<T>[K]>['catch']
  }

export const on = assign(
  onEvent,
  {
    once: function onEventOnce<T extends EventTarget, K extends EventKeys<T>>(
      t: T,
      e: K,
      f: EventHandler<T, EventsOf<T>[K], K>,
      options?: AddEventListenerOptions
    ): OnceReturn<T, K> {
      options = { ...options, once: true }

      const deferred = Deferred<EventsOf<T>[K]>()

      const inner: any = function (this: any, e: any) {
        const retValue = f.call(this, e)
        deferred.resolve(e)
        return retValue
      }

      const off = onEvent(e as any, inner, options)

      return Object.assign(
        off,
        {
          then: deferred.promise.then.bind(deferred.promise),
          catch: deferred.promise.catch.bind(deferred.promise),
        }
      )
    } as any
  } as {
    once: {
      onEventOnce<T extends EventEmitter<any>, K extends EventEmitterEventKeys<T>>(
        t: T,
        e: K,
        f: EventEmitterEvents<T>[K],
        options?: EventEmitterOptions
      ): OnceReturnEE<T, K>
      onEventOnce<T extends EventTarget, K extends EventKeys<T>>(
        t: T,
        e: K,
        f: EventHandler<T, EventsOf<T>[K], K>,
        options?: AddEventListenerOptions
      ): OnceReturn<T, K>
    }
  })
