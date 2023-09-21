export function getFileId(path: string) {
  if (/\.[jt]sx?$/.test(path)) {
    path = path.split('/').pop()!.replace(/\.[jt]sx?$/, '')
  }
  return path
}
