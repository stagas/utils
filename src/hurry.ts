import { timeout } from './timeout.ts'

export function hurry(ms: number, promise: Promise<any>) {
  return Promise.race([promise, timeout(ms)])
}
