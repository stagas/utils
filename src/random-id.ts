export function randomId() {
  return `${String.fromCharCode(97 + Math.random() * 25)
    }${(Math.random() * 10e7 | 0).toString(36)}`
}
