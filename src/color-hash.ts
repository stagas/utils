import { checksum } from './checksum.ts'

export function colorHash(string: string, minColorHex = '888', maxColorHex = 'bbb') {
  const minColor = parseInt(minColorHex, 16)
  const maxColor = parseInt(maxColorHex, 16)
  const scale = maxColor - minColor
  const color = ((
    (checksum(string) | 0) % scale
  ) + minColor).toString(16).padStart(3, '0')
  return color
}
