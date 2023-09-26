export const validateType = Object.assign(function validateType<T>(obj: T): T {
  return obj
}, {
  assignable: function assignable<T>(obj: Partial<T>): Partial<T> {
    return obj
  }
})
