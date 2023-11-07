export function whenImageReady(image: HTMLImageElement) {
  return new Promise<HTMLImageElement>(resolve => {
    image.onload = () => resolve(image)
  })
}
