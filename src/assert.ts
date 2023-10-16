import type { error } from './error.ts'

export function assert(
  cond: boolean,
  errCtor: ReturnType<typeof error>,
  errMsg: string,
  callSite?: (...args: any[]) => any) {
  if (!cond) {
    throw new errCtor(errMsg, callSite)
  }
}
