import { colorHash } from './color-hash.ts'

export function ansiColorFor(string: string) {
  const [r, g, b] = colorHash(string).split('').map(x => parseInt(x + x, 16))
  return `\x1B[38;2;${r};${g};${b}m`
}
