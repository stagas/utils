export function randomHash() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const len = bytes.byteLength
  let binary = ''
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replaceAll(/[^a-z]/gi, '')
}
