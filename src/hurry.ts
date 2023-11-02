import { timeout } from './timeout.ts'

export function hurry<T>(ms: number, promise: Promise<T>): Promise<T | void> {
  return Promise.race([promise, timeout(ms)])
}
