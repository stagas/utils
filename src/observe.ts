export interface MutationObserverSettings extends MutationObserverInit {
  /** Fire the observer callback initially with no mutations. */
  initial?: boolean
}

export interface ResizeObserverSettings extends ResizeObserverOptions {
  /** Fire the observer callback initially with no mutations. */
  initial?: boolean
}

export interface IntersectionObserverSettings {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  observer?: IntersectionObserver
}

export const observe = {
  resize(el: Element, fn: ResizeObserverCallback, settings?: ResizeObserverSettings) {
    const observer = new ResizeObserver(fn)
    observer.observe(el, settings)
    if (settings?.initial) fn([], observer)
    return () => observer.disconnect()
  },
  intersection(el: Element, fn: IntersectionObserverCallback, settings?: IntersectionObserverSettings) {
    const observer = settings?.observer ?? new IntersectionObserver(fn, settings)
    observer.observe(el)
    return Object.assign(() => {
      if (settings?.observer) observer.unobserve(el)
      else observer.disconnect()
    }, { observer })
  },
  mutation(el: Element | ShadowRoot, fn: MutationCallback, settings?: MutationObserverSettings) {
    const observer = new MutationObserver(fn)
    observer.observe(el, settings)
    if (settings?.initial) fn([], observer)
    return () => observer.disconnect()
  },
  gc: <T>(item: object, value: T, fn: (heldValue: T) => void) => {
    const reg = new FinalizationRegistry(fn)
    reg.register(item, value)
    return reg
  },
}
