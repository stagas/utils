export function seedRand(seed = 1) {
  return function rand(amt = 1) {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return (((t ^ t >>> 14) >>> 0) / 4294967296) * amt
  }
}
