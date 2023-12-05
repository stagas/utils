// credits: chatgpt

type ObjectRecord = Record<number, object>

export function objectDiff<T extends ObjectRecord>(prev: T, next: T, compareFn = Object.is) {
  const created = {} as T
  const updated = {} as T
  const deleted = {} as T

  // Check for created and updated keys
  Object.keys(next).forEach((key: string | number) => {
    key = +key
    if (!prev[key]) {
      // Key is present in b but not in a, it's created
      created[key] = next[key]
    }
    else if (!compareFn(prev[key], next[key])) {
      // Key is present in both a and b, but values are different, it's updated
      updated[key] = next[key]
    }
  })

  // Check for deleted keys
  Object.keys(prev).forEach((key: string | number) => {
    key = +key
    if (!next[key]) {
      // Key is present in a but not in b, it's deleted
      deleted[key] = prev[key]
    }
  })

  return { created, updated, deleted }
}
