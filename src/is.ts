import { memoizeByRef } from './memoize.ts'
import { Ctor } from './types.ts'

export function isObject<T>(v: T): v is T & object {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function isObjectLiteral<T>(v: T): v is T & object {
  return typeof v === 'object' && v !== null
    // @ts-expect-error
    && v.__proto__ === Object.prototype
}

// @ts-expect-error
const typedArrayCtor = Int8Array.__proto__
export function isArrayLike<T extends object>(v: T): v is T & { [Symbol.iterator]: unknown } {
  return Array.isArray(v) || v instanceof typedArrayCtor
}

export function isFunction(x: any): x is (...args: any[]) => any {
  return typeof x === 'function'
}

/** Determinese whether the parameter is a `class {}` instead of a normal function. */
export const isCtor = memoizeByRef(function isCtor(v: unknown): v is Ctor {
  return isFunction(v) && v.toString().startsWith('class')
})

export function test_is() {
  // @env browser
  describe('isCtor', () => {
    it('functions are false', () => {
      expect(isCtor(function () { })).toEqual(false)
    })
    it('class are true', () => {
      expect(isCtor(class { })).toEqual(true)
    })
    it('only calls toString() once', () => {
      let calls = 0
      const fn = Object.assign(function () { }, {
        toString() {
          calls++
          return (function () { }).toString()
        }
      })
      expect(isCtor(fn)).toEqual(false)
      expect(calls).toEqual(1)
      expect(isCtor(fn)).toEqual(false)
      expect(calls).toEqual(1)
    })
  })
}
