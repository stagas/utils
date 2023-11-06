import { ansiColorFor } from './index.ts'

export function colory(...args: any[]) {
  let s: string[] = []

  let i = 0
  for (; i < args.length; i++) {
    const v = args[i]
    if (typeof v === 'string') {
      s.push(ansiColorFor(v) + v)
    }
    else {
      break
    }
  }

  console.warn(s.join(' '), ...args.slice(i))
}
