import { iterify } from './iterify'

type Off = (() => void) | void

export function genify<T, U>(fn: (cb: (v: U) => void) => Off, it: (v: U) => T) {
  return async function* () {
    for await (const v of iterify(fn)) {
      yield it(v as U)
    }
  }
}
