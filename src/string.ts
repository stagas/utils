type Key = string | number | symbol
type List<A = any> = ReadonlyArray<A>
type AAt<A, K extends Key> = A extends List
  ? number extends A['length'] ? K extends number | `${number}` ? A[never] | undefined : undefined
  : K extends keyof A ? A[K]
  : undefined
  : unknown extends A ? unknown
  : K extends keyof A ? A[K]
  : undefined
export type At<S extends string, K extends number> = AAt<Split<S, ''>, K>
type Literal = string | number | bigint | boolean
/**
 * @hidden
 */
type _Join<T extends List, D extends string> = T extends [] ? ''
  : T extends [Literal] ? `${T[0]}`
  : T extends [Literal, ...infer R] ? `${T[0]}${D}${_Join<R, D>}`
  : string
/**
 * Concat many literals together
 * @param T to concat
 * @param D to delimit
 */
export type Join<T extends List<Literal>, D extends string = ''> = _Join<T, D> extends infer X ? Cast<X, string> : never
/**
 * Ask TS to re-check that `A1` extends `A2`.
 * And if it fails, `A2` will be enforced anyway.
 * Can also be used to add constraints on parameters.
 * @param A1 to check against
 * @param A2 to cast to
 * @returns `A1 | A2`
 * @example
 * ```ts
 * import {A} from 'ts-toolbelt'
 *
 * type test0 = A.Cast<'42', string> // '42'
 * type test1 = A.Cast<'42', number> // number
 * ```
 */
type LLength<L extends List> = L['length']

type Cast<A1, A2> = A1 extends A2 ? A1 : A2
export type Length<S extends string> = LLength<Split<S, ''>>
export type Replace<S extends string, R extends Literal, W extends Literal> = _Replace<S, R, W> extends infer X
  ? Cast<X, string>
  : never
type _Replace<S extends string, R extends Literal, W extends Literal> = S extends `${infer BS}${R}${infer AS}`
  ? Replace<`${BS}${W}${AS}`, R, W>
  : S
type __Split<S extends string, D extends string, T extends string[] = []> = S extends `${infer BS}${D}${infer AS}`
  ? __Split<AS, D, [...T, BS]>
  : [...T, S]
/**
 * @hidden
 */
type _Split<S extends string, D extends string = ''> = D extends '' ? Pop<__Split<S, D>> : __Split<S, D>
/**
 * Split `S` by `D` into a [[List]]
 * @param S to split up
 * @param D to split at
 */
export type Split<S extends string, D extends string = ''> = _Split<S, D> extends infer X ? Cast<X, string[]> : never
type Pop<L extends List> = L extends (readonly [...infer LBody, any] | readonly [...infer LBody, any?]) ? LBody : L
