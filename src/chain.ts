type AnyFns = AnyFn[]
type AnyFn = ((...args: any[]) => any) | AnyFns | void | false

export function chain(rest: AnyFn): () => any
export function chain(...rest: AnyFn[]): () => any
export function chain(...rest: AnyFn[]) {
  const fns: any = (rest as any).flat(Infinity).filter(Boolean)
  return runFns.bind(null, fns)
}

function runFns(fns: AnyFn[], ...args: any[]) {
  for (const fn of fns) fn && (fn as any)(...args)
}
