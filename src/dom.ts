import { deepMerge } from './deep-merge.ts'
import { observe } from './observe.ts'
import { on } from './on.ts'
import { prevent, stop } from './prevent-stop.ts'

export const dom = {
  el: <T extends HTMLElement>(tag: string, props?: object): T =>
    deepMerge(
      document.createElement(tag),
      props
    ) as T,
  get body() {
    return document.body
  },
  get head() {
    return document.head
  },
  observe,
  stop,
  prevent,
  on,
}
