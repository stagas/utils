import { deepMerge } from './deep-merge.ts'

export const dom = {
  el: <T extends HTMLElement>(tag: string, props?: object): T =>
    deepMerge(
      document.createElement(tag),
      props
    ) as T,
  append: Object.assign((parent: Element, el: Element) => {
    parent.appendChild(el)
  }, {
    head: (el: Element) => {
      document.head.appendChild(el)
    },
    body: (el: Element) => {
      document.body.appendChild(el)
    },
  }),
}
