import { timeout } from './timeout'

export function hurry(ms: number, promise: Promise<any>) {
  return Promise.race([promise, timeout(ms)])
}
