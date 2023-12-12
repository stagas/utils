import { Deferred } from './deferred.ts'
import { timeout } from './timeout.ts'

export interface QueueOptions {
  concurrency: number
  retries: number[]
}

export interface Queue<T> {
  tasks: Task[]
  push: (fn: AsyncFn) => void
  flush: () => Promise<PromiseSettledResult<T>[]>
}

interface Task {
  fn: () => Promise<any>
  retries: number[]
}

type AsyncFn = () => Promise<any>

export function createConcurrentQueue<T = unknown>(options: QueueOptions): Queue<T> {
  const { concurrency, retries } = options

  let deferred: Deferred<PromiseSettledResult<T>[]>
  const results: PromiseSettledResult<T>[] = []
  const fns: AsyncFn[] = []

  let tasks: Task[] = []
  let initial = true
  let current = 0

  function push(fn: AsyncFn) {
    fns.push(fn)
    return queue
  }

  function flush() {
    if (initial) {
      initial = false
      tasks = fns.map(fn => ({
        fn,
        retries: [0, ...retries]
      }))
    }

    if (tasks.length > 0 && current < concurrency) {
      current++

      const { fn, retries } = tasks.shift()!
      const ms = retries.shift()!

        ; (!ms ? Promise.resolve() : timeout(ms)).then(async () => {
          try {
            const value = await fn()
            results.push({ status: 'fulfilled', value })
          }
          catch (error) {
            if (retries.length) {
              tasks.push({ fn, retries })
              return flush()
            }
            results.push({ status: 'rejected', reason: error })
          }

          current--

          if (!tasks.length && !current) deferred.resolve(results)
          else flush()
        })

      flush()
    }
    else if (!tasks.length && !current) {
      deferred.resolve(results)
    }

    return deferred.promise
  }

  const queue = {
    tasks,
    push,
    flush,
  }

  return queue
}
