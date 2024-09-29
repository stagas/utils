export function timeMs(date: Date) {
  const time = date.toTimeString().split(' ')[0]
  const ms = date.getMilliseconds().toString().padStart(3, '0')
  return `${time}.${ms}`
}
