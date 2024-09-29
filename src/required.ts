import { NonNull } from './types.ts'

const proxies = {
  requiredTruthyFast: new WeakMap(),
  requiredFalseyFast: new WeakMap(),
  requiredFast: new WeakMap(),
  required: new WeakMap(),
}

export const MissingDependencyErrorSymbol = Symbol('MissingDependencyError')
export const BooleanDependencyErrorSymbol = Symbol('BooleanDependencyError')

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
    throw BooleanDependencyErrorSymbol
  }
}

const requiredProxyHandlerFalseyFast = {
  get(t: any, prop: any) {
    if (prop in t && !t[prop]) {
      return false
    }
    throw BooleanDependencyErrorSymbol
  }
}

const requiredProxyHandlerFast = {
  get(t: any, prop: any) {
    if (prop in t && t[prop] != null) {
      return t[prop]
    }
    throw MissingDependencyErrorSymbol
  }
}

const requiredProxyHandler = {
  get(t: any, prop: any) {
    if (prop in t && t[prop] != null) {
      return t[prop]
    }
    throw new MissingDependencyError(prop)
  }
}

export function requiredTruthyFast<T extends object>(of: T): NonNull<T> {
  let proxy = proxies.requiredTruthyFast.get(of)
  if (!proxy) proxies.requiredTruthyFast.set(of, proxy = new Proxy(of, requiredProxyHandlerTruthyFast))
  return proxy as any
}

export function requiredFalseyFast<T extends object>(of: T): NonNull<T> {
  let proxy = proxies.requiredFalseyFast.get(of)
  if (!proxy) proxies.requiredFalseyFast.set(of, proxy = new Proxy(of, requiredProxyHandlerFalseyFast))
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
