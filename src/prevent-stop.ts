export const prevent = Object.assign((e: Partial<Event>) => {
  e.preventDefault?.()
}, {
  stop: (e: Partial<Event>) => {
    e.preventDefault?.()
    e.stopPropagation?.()
  }
})

export const stop = Object.assign((e: Partial<Event>) => {
  e.stopPropagation?.()
}, {
  prevent: (e: Partial<Event>) => {
    e.preventDefault?.()
    e.stopPropagation?.()
  }
})
