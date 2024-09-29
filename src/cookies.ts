export function createCookie(key: string, value: string, expires: Date, ...flags: string[]) {
  return [
    serializeCookie(key, value),
    `expires=${expires.toUTCString()}`,
    ...flags
  ].join('; ')
}

export function parseCookie(cookie: string, target: Record<string, string> = {}) {
  return cookie
    .split(';')
    .map(pair => pair.split('='))
    .reduce((target, [key, value]) => {
      if (key == null || value == null) return target
      target[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim())
      return target
    }, target)
}

export function serializeCookie(key: string, value: string) {
  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
}
