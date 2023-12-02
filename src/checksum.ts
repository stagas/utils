// credits: chat-gpt
export function checksum(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 6) - hash + str.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}
