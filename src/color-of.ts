export function colorOf(id: string, sat = 100, lum = 65) {
  return `hsl(${(Math.round(parseInt(id, 36) / 25) * 25) % 360}, ${sat}%, ${lum}%)`
}
