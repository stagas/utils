import { NonNull } from './types'

let requiredTarget: any

export const MissingDependencyErrorSymbol = Symbol('MissingDependencyError')

export class MissingDependencyError extends Error {
  constructor(prop: string) {
    super(`Property "${prop}" is required to be a non-nullish value.`)
    this.name = 'MissingDependencyError'
    Error.captureStackTrace(this, requiredProxyHandler.get)
  }
}

const requiredProxyHandlerTruthyFast = {
  get(_: any, prop: any) {
    // requiredTarget can be overwritten at the getter, so we use a const copy here.
    const t = requiredTarget
    if (prop in t && t[prop]) {
      return t[prop]
    }
    // TODO: we reuse the symbol, but maybe we need different?
    throw MissingDependencyErrorSymbol
  }
}

const requiredProxyHandlerFast = {
  get(_: any, prop: any) {
    // requiredTarget can be overwritten at the getter, so we use a const copy here.
    const t = requiredTarget
    if (prop in t && t[prop] != null) {
      return t[prop]
    }
    throw MissingDependencyErrorSymbol
  }
}

const requiredProxyHandler = {
  get(_: any, prop: any) {
    // requiredTarget can be overwritten at the getter, so we use a const copy here.
    const t = requiredTarget
    if (prop in t && t[prop] != null) {
      return t[prop]
    }
    throw new MissingDependencyError(prop)
  }
}

const RequiredProxyTruthyFast = new Proxy({}, requiredProxyHandlerTruthyFast)
const RequiredProxyFast = new Proxy({}, requiredProxyHandlerFast)
const RequiredProxy = new Proxy({}, requiredProxyHandler)

export function requiredTruthyFast<T extends object>(of: T): NonNull<T> {
  requiredTarget = of
  return RequiredProxyTruthyFast as any
}

export function requiredFast<T extends object>(of: T): NonNull<T> {
  requiredTarget = of
  return RequiredProxyFast as any
}

export function required<T extends object>(of: T): NonNull<T> {
  requiredTarget = of
  return RequiredProxy as any
}
