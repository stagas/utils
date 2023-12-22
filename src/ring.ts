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
        (x + 1) * chunkSize
      )
    ),
    { buffer }
  )
}
