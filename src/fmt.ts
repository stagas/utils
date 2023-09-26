import memoize from './memoize.ts'

let fmtMemoized: typeof fmtFormat
export function fmt(
  value: number,
  minimumFractionDigits: number = 1,
  maximumSignificantDigits: number = 3,
  maximumFractionDigits: number = minimumFractionDigits,
  minimumSignificantDigits: number = 1,
  minimumIntegerDigits: number = 1
) {
  fmtMemoized ??= memoize(fmtFormat)
  return fmtFormat(
    minimumFractionDigits,
    maximumSignificantDigits,
    maximumFractionDigits,
    minimumSignificantDigits,
    minimumIntegerDigits
  )(value)
}

export function fmtFormat(
  minimumFractionDigits: number = 1,
  maximumSignificantDigits: number = 3,
  maximumFractionDigits: number = minimumFractionDigits,
  minimumSignificantDigits: number = 1,
  minimumIntegerDigits: number = 1
) {
  return new Intl.NumberFormat('en', {
    minimumFractionDigits,
    maximumSignificantDigits,
    maximumFractionDigits,
    minimumSignificantDigits,
    minimumIntegerDigits
  }).format
}
