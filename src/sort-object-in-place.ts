function sortCompareKeys([a]: [string, any], [b]: [string, any]) {
  return a < b ? -1 : a > b ? 1 : 0
}

export function sortObjectInPlace<T extends Record<string, any>>(data: T): T {
  const sorted = Object.fromEntries(
    Object.entries(data).sort(sortCompareKeys)
  )
  for (const key in data) {
    delete data[key]
  }
  Object.assign(data, sorted)
  return data
}
