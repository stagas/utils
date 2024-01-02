export const prevent = Object.assign((e?: Partial<Event> | undefined) => {
  e?.preventDefault?.()
}, {
  stop: (e?: Partial<Event> | undefined) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
  }
})

export const stop = Object.assign((e?: Partial<Event> | undefined) => {
  e?.stopPropagation?.()
}, {
  prevent: (e?: Partial<Event> | undefined) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
  }
})
