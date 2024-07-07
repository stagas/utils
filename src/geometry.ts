const p: Point = { x: 0, y: 0 }

export interface Point {
  x: number
  y: number
}

export namespace Point {
  export function distance(a: Point, b: Point) {
    diff(a, b, p)
    return mag(p)
  }
  export function mag(a: Point) {
    return Math.hypot(a.x, a.y)
  }
  export function diff(a: Point, b: Point, o: Point) {
    o.x = a.x - b.x
    o.y = a.y - b.y
  }
  export function add(a: Point, b: Point) {
    a.x += b.x
    a.y += b.y
  }
  export function set(a: Point, x: number, y: number) {
    a.x = x
    a.y = y
  }
}
