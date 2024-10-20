export function randomHex(digits = 3, minHex: number | string = '8', maxHex: number | string = 'b') {
  const min = parseInt(minHex.toString(), 16)
  const max = parseInt(maxHex.toString(), 16)
  const scale = max - min
  const hex = Array.from({ length: digits }, () =>
    (((Math.random() * scale) | 0) + min).toString(16)
  ).join('')
  return hex
}
