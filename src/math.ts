export function clamp(min: number, max: number, x: number) {
  if (x < min) x = min
  if (x > max) x = max
  return x
}

// chatgpt
export function nextPowerOfTwo(x: number): number {
  // If x is already a power of two, return it
  if ((x & (x - 1)) === 0) {
    return x
  }

  // Find the nearest power of two greater than x
  let power = 1
  while (power < x) {
    power <<= 1
  }
  return power
}

export function findPower(x: number): number {
  return Math.abs(Math.log(x) / Math.log(0.5))
}

export function cubicBezier(t: number) {
  return t * t * (3 - 2 * t)
}
