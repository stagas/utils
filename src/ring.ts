export type Ring = Float32Array[] & { buffer: Float32Array }

export function toRing<T extends Float32Array>(buffer: T, chunkSize = 128): Ring {
  const length = buffer.length / chunkSize
  if ((length | 0) !== length) {
    throw new Error('Ring "buffer" must be divisible exactly by the "chunkSize".')
  }
  return Object.assign(
    Array.from({ length }, (_, x) =>
      buffer.subarray(
        x * chunkSize,
        (x + 1) * chunkSize,
      )),
    { buffer },
  )
}

let ringSwapMap: WeakMap<Ring, Map<number, Float32Array>>

export function fromRing<T extends Float32Array>(ctor: { new(length: number): T }, ring: Ring, ringPos: number, chunks = ring.length): T {
  ringSwapMap ??= new WeakMap()
  let sizeMap = ringSwapMap.get(ring)
  if (!sizeMap) {
    sizeMap = new Map()
    ringSwapMap.set(ring, sizeMap)
  }

  let swap = sizeMap.get(chunks)
  if (!swap) {
    const chunkSize = ring[0].length
    swap = new ctor(chunks * chunkSize)
    sizeMap.set(chunks, swap)
  }

  let j = 0
  const chunkSize = ring[0].length
  const ringsTotal = ring.length
  for (let i = ringPos; i < ringsTotal && j < chunks; i++) {
    swap.set(ring[i], (j++) * chunkSize)
  }
  for (let i = 0; i < ringPos && j < chunks; i++) {
    swap.set(ring[i], (j++) * chunkSize)
  }
  return swap as T
}
