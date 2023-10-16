import { entries, fromEntries } from './object'

export function error(errCtor: ErrorConstructor, name: string, pre?: string) {
  return class extends errCtor {
    constructor(msg: string, callSite?: (...args: any[]) => any) {
      super((pre ? pre + ': ' : '') + msg)
      this.name = name
      if (callSite) Error.captureStackTrace(this, callSite)
    }
  }
}

export type Errs = Record<string, [ctor: ErrorConstructor, pre?: string]>

export function errs<T extends Errs>(spec: T) {
  return fromEntries(
    entries(spec).map(([key, value]) =>
      [key, error(value[0], key, value[1])]
    )
  )
}
