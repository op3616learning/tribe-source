import { Price } from 'tribe-api'

export { formatCount } from 'tribe-translation'

export const formatPrice = (price?: string | Price | null): string => {
  if (!price) {
    return ''
  }

  if (typeof price === 'string') {
    return price
  }

  return `${price.formattedValue} ${price.currency?.toUpperCase()}`
}
