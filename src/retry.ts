import { timeout } from './timeout.ts'

export async function retry<T>(fn: () => Promise<T>, retries: number[]) {
  retries = [0, ...retries]

  let ms: number | undefined
  let error!: Error

  while ((ms = retries.shift()) != null) {
    if (ms) await timeout(ms)

    try {
      return await fn()
    }
    catch (e) {
      error = e as Error
    }
  }

  throw error
}
