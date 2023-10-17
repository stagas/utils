import { NonNull } from './types'

let requiredTarget: any

export class MissingDependencyError extends Error {
  constructor(prop: string) {
    super(`Property "${prop}" is required to be a non-nullish value.`)
    this.name = 'MissingDependencyError'
    // @ts-ignore
    Error.captureStackTrace(this, requiredProxyHandler.get)
  }
}

const requiredProxyHandler = {
  get(_: any, prop: any) {
    // console.log(prop, requiredTarget[prop])
    if (prop in requiredTarget && requiredTarget[prop] != null) {
      return requiredTarget[prop]
    }
    throw new MissingDependencyError(prop)
  }
}

export const MissingDependencyErrorSymbol = Symbol('MissingDependencyError')

const requiredProxyHandlerFast = {
  get(_: any, prop: any) {
    console.log(prop, requiredTarget[prop])
    if (prop in requiredTarget && requiredTarget[prop] != null) {
      return requiredTarget[prop]
    }
    throw MissingDependencyErrorSymbol
  }
}

const RequiredProxy = new Proxy({}, requiredProxyHandler)
const RequiredProxyFast = new Proxy({}, requiredProxyHandlerFast)

export function required<T extends object>(of: T): NonNull<T> {
  requiredTarget = of
  return RequiredProxy as any
}

export function requiredFast<T extends object>(of: T): NonNull<T> {
  requiredTarget = of
  return RequiredProxyFast as any
}
