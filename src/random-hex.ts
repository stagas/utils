export function randomHex(digits = 3, minHex = '888', maxHex = 'bbb') {
  const min = parseInt(minHex, 16)
  const max = parseInt(maxHex, 16)
  const scale = max - min
  const hex = ((
    (Math.random() * scale) | 0
  ) + min).toString(16).padStart(digits, '0')
  return hex
}
