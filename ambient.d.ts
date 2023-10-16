import '@total-typescript/ts-reset'
import '@types/jest'
declare global {
  interface ErrorConstructor {
    captureStackTrace(thisArg: any, func: any): void
  }
}
