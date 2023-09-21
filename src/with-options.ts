// TODO: this needs to be benched, which closure type is faster.
export function withOptions(options: any, fn: any, self: any) {
  function wrapper(this: any, ...args: any[]) {
    try {
      const result = fn.call(self ?? this, options, ...args)
      return result
    }
    finally {
      for (const k in options) {
        if (!Array.isArray(options[k])) {
          options[k] = false
        }
      }
    }
  }

  function wrapperArrayArg(key: string) {
    return function (this: any, arg: any[], ...args: any[]) {
      try {
        options[key] = arg
        const result = fn.call(self ?? this, options, ...args)
        return result
      }
      finally {
        options[key] = []
      }
    }
  }

  for (const key in options) {
    if (Array.isArray(options[key])) {
      ; (wrapper as any)[key] = wrapperArrayArg(key)
    }
    else {
      Object.defineProperty(wrapper, key, {
        enumerable: true,
        configurable: false,
        get(this: any) {
          options[key] = true
          return wrapper
        }
      })
    }
  }

  return wrapper
}
