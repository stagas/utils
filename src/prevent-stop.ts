export const prevent = Object.assign((e: Event) => {
  e.preventDefault()
}, {
  stop: (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
})

export const stop = Object.assign((e: Event) => {
  e.stopPropagation()
}, {
  prevent: (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
})
