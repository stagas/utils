export function promisify(fn: any) {
  return function (this: any, ...args: any[]) {
    return new Promise<any>((resolve, reject) => {
      fn.call(this, ...args, (err: any, ...data: any[]) => {
        if (err)
          reject(err)
        else
          resolve(data)
      })
    })
  }
}
