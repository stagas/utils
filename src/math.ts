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

/**
 * Round half away from zero ('commercial' rounding)
 * Uses correction to offset floating-point inaccuracies.
 * Works symmetrically for positive and negative numbers.
 * See https://stackoverflow.com/a/48764436/419436
 */
export function round(num: number, decimalPlaces = 0): number {
  const p = Math.pow(10, decimalPlaces)
  const n = num * p * (1 + Number.EPSILON)
  return Math.round(n) / p
}
export function scaleLinear(
  rangeMin: number,
  rangeMax: number,
  domainMin: number,
  domainMax: number,
) {
  const range = rangeMax - rangeMin
  const domain = domainMax - domainMin
  return (x: number): number => ((x - rangeMin) / range) * domain + domainMin
}

export function median(nums: number[]): number {
  const len = nums.length
  if (len < 2) return 0
  const sorted = [...nums].sort()
  const halfLen = len / 2
  return (
    (sorted[Math.floor(halfLen)]
      + sorted[Math.ceil(halfLen)])
    / 2
  )
}

export function sum(nums: number[]) {
  return nums.reduce((acc, value) => acc + value, 0)
}

export function mean(nums: number[]) {
  if (!nums.length) return 0
  return sum(nums) / nums.length
}

export function std(nums: number[]): number {
  const m = mean(nums)
  return Math.sqrt(
    nums.reduce((total, n) => total + (n - m) ** 2, 0) / nums.length
  )
}

export interface Stats {
  min: number
  max: number
  mean: number
  median: number
  std: number
}

export interface AggregateStats {
  min: number
  minStd: number
  max: number
  maxStd: number
  median: number
  medianStd: number
  mean: number
  meanStd: number
}

export function stats(nums: number[]): Stats {
  return {
    min: Math.min(...nums),
    max: Math.max(...nums),
    mean: mean(nums),
    median: median(nums),
    std: std(nums),
  }
}

export function aggregateStats(results: Stats[]): AggregateStats {
  const mins = results.map(result => result.min)
  const maxs = results.map(result => result.max)
  const medians = results.map(result => result.median)
  const means = results.map(result => result.mean)
  return {
    min: mean(mins),
    minStd: std(mins),
    max: mean(maxs),
    maxStd: std(maxs),
    median: mean(medians),
    medianStd: std(medians),
    mean: mean(means),
    meanStd: std(means),
  }
}

export function cubic(i: number, values: number[]) {
  const dl = values.length - 1

  i = i < 0 ? 0 : i > dl ? dl : i

  const p = i | 0
  const fr = i - p

  // const m1 =
  const x0 = values[p]
  const xm = values[p > 1 ? p - 1 : 0]
  const x1 = values[p < dl - 1 ? p + 1 : dl]
  const x2 = values[p < dl - 2 ? p + 2 : dl]

  const a = (3 * (x0 - x1) - xm + x2) * .5
  const b = 2 * x1 + xm - (5 * x0 + x2) * .5
  const c = (x1 - xm) * .5

  return (((a * fr) + b)
    * fr + c)
    * fr + x0
}
