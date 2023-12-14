import { timeout } from './timeout.ts'

export function hurry<T>(ms: number, promise: Promise<T>): Promise<T | void> {
  return Promise.race([promise, timeout(ms)])
}

export function hurryThrow<T>(ms: number, promise: Promise<T>): Promise<T | void> {
  return Promise.race([promise, timeout(ms).then(() =>
    Promise.reject(new Error('Timed out: >' + ms + 'ms'))
  )])
}
