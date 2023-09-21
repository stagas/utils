export const fmt = new Intl.NumberFormat('en', {
  minimumSignificantDigits: 1,
  minimumFractionDigits: 1,
  maximumFractionDigits: 3,
  maximumSignificantDigits: 3,
  minimumIntegerDigits: 1
}).format
