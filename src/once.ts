export function once<T extends ((this: any, ...args: any[]) => any) | void>(fn: T): T {
  if (!fn) return fn

  let res: any
  function wrap(this: any, ...args: any[]) {
    const savefn = fn
    // @ts-ignore
    fn = void 0
    res ??= savefn?.apply(this, args)
    return res
  }

  return wrap as T
}
