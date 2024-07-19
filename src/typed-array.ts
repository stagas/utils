export const typedArrayConstructors = [
  Uint8Array,
  Uint16Array,
  Uint32Array,
  BigUint64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  BigInt64Array,
  Float32Array,
  Float64Array,
]

export type TypedArrayConstructor = typeof typedArrayConstructors[0]

export type TypedArray<T extends TypedArrayConstructor> = InstanceType<T>
