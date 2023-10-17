import { NonNull } from './types'

let requiredTarget: any

const proxies = {
  requiredTruthyFast: new WeakMap(),
  requiredFast: new WeakMap(),
  required: new WeakMap(),
}

export const MissingDependencyErrorSymbol = Symbol('MissingDependencyError')
export const NonTruthyDependencyErrorSymbol = Symbol('NonTruthyDependencyError')

export class MissingDependencyError extends Error {
  constructor(prop: string) {
    super(`Property "${prop}" is required to be a non-nullish value.`)
    this.name = 'MissingDependencyError'
    Error.captureStackTrace(this, requiredProxyHandler.get)
  }
}

const requiredProxyHandlerTruthyFast = {
  get(t: any, prop: any) {
    if (prop in t && t[prop]) {
      return t[prop]
    }
    console.log('NONTRUTHY', prop)
    throw NonTruthyDependencyErrorSymbol
  }
}

const requiredProxyHandlerFast = {
  get(t: any, prop: any) {
    if (prop in t && t[prop] != null) {
      return t[prop]
    }
    console.log('MISSING', prop)
    throw MissingDependencyErrorSymbol
  }
}

const requiredProxyHandler = {
  get(t: any, prop: any) {
    if (prop in t && t[prop] != null) {
      return t[prop]
    }
    console.log('MISSING', prop)
    throw new MissingDependencyError(prop)
  }
}

// const RequiredProxyTruthyFast = new Proxy({}, requiredProxyHandlerTruthyFast)
// const RequiredProxyFast = new Proxy({}, requiredProxyHandlerFast)
// const RequiredProxy = new Proxy({}, requiredProxyHandler)

export function requiredTruthyFast<T extends object>(of: T): NonNull<T> {
  let proxy = proxies.requiredTruthyFast.get(of)
  if (!proxy) proxies.requiredTruthyFast.set(of, proxy = new Proxy(of, requiredProxyHandlerTruthyFast))
  return proxy as any
}

export function requiredFast<T extends object>(of: T): NonNull<T> {
  let proxy = proxies.requiredFast.get(of)
  if (!proxy) proxies.requiredFast.set(of, proxy = new Proxy(of, requiredProxyHandlerFast))
  return proxy as any
}

export function required<T extends object>(of: T): NonNull<T> {
  let proxy = proxies.required.get(of)
  if (!proxy) proxies.required.set(of, proxy = new Proxy(of, requiredProxyHandler))
  return proxy as any
}
