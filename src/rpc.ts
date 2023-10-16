import { Ctor } from './types.ts'
import { Deferred } from './deferred.ts'
import { Getter } from './proxy-getter.ts'

const defaultTransferables: Ctor[] = [
  typeof OffscreenCanvas !== 'undefined' ? OffscreenCanvas : void 0,
  typeof MessagePort !== 'undefined' ? MessagePort : void 0
].filter(Boolean) as Ctor[]

export type Rpc = (method: string, ...args: any[]) => any

export const rpc = <TRemote extends object>(
  port: MessagePort,
  api: Record<string, any> = {},
  transferables: Ctor[] = defaultTransferables
) => {
  const xfer = (args: any[], transferables: Ctor[]) => args.reduce((p, n) => {
    if (typeof n === 'object') {
      if (transferables.some((ctor) =>
        n instanceof ctor)) {
        p.push(n)
      } else
        for (const key in n) {
          if (
            n[key] &&
            transferables.some((ctor) =>
              n[key] instanceof ctor)
          ) {
            p.push(n[key])
          }
        }
    }
    return p
  }, [] as Transferable[])

  let callbackId = 0

  const calls = new Map<number, Deferred<any>>()

  port.onmessage = async ({ data }) => {
    const { cid } = data

    if (data.method) {
      let result: any
      try {
        if (!(data.method in api)) {
          throw new TypeError(
            `Method "${data.method}" does not exist in RPC API.`
          )
        }

        if (typeof api[data.method] !== 'function') {
          throw new TypeError(
            `Property "${data.method}" exists in RPC but is not type function, instead it is type: "${typeof api[data.method]}"`
          )
        }

        result = await api[data.method](...data.args)

        port.postMessage(
          { cid, result },
          xfer([result], transferables)
        )
      } catch (error) {
        port.postMessage({ cid, error })
      }
    }
    else {
      if (!calls.has(cid)) {
        console.log(cid, calls.size, Object.keys(data.result))
        throw new ReferenceError('Callback id not found: ' + cid)
      }

      const { resolve, reject } = calls.get(cid)!
      calls.delete(data.cid)

      if (data.error) reject(data.error)
      else resolve(data.result)
    }
  }

  const call = (method: string, ...args: any[]) => {
    const cid = ++callbackId

    const deferred = Deferred()

    calls.set(cid, deferred)

    port.postMessage(
      { method, args, cid },
      xfer(args, transferables)
    )

    return deferred.promise
  }

  const getter = Getter(key =>
    call.bind(null, key),
    call
  ) as unknown as Rpc & TRemote

  return getter
}

export function test_rpc() {
  // @env browser
  describe('rpc', () => {
    it('works', async () => {
      const { port1, port2 } = new MessageChannel()

      let foo = 0
      let bar = 0

      const a_api = {
        async runFoo(x: number) {
          foo += x
          return foo
        }
      }

      const a = rpc<typeof b_api>(port1, a_api)

      const b_api = {
        async runBar(x: number) {
          bar += x
          return bar
        }
      }
      const b = rpc<typeof a_api>(port2, b_api)

      await a.runBar(1)
      await b.runFoo(1)

      expect(foo).toBe(1)
      expect(bar).toBe(1)

      await a('runBar', 2)
      await b('runFoo', 2)

      expect(foo).toBe(3)
      expect(bar).toBe(3)
    })
  })
}
