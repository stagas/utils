import { PointLike } from './types.ts'

export function drawText(
  c: CanvasRenderingContext2D,
  p: PointLike,
  text: string,
  color: string = '#fff',
  outlineWidth = 3.35,
  outlineColor = '#000',
) {
  c.lineWidth = outlineWidth
  c.strokeStyle = outlineColor
  c.strokeText(text, p.x, p.y)
  c.fillStyle = color
  c.fillText(text, p.x, p.y)
}
