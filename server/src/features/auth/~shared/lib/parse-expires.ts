export const parseExpires = (expires: string | number): number => {
  if (typeof expires === 'number') return expires * 1000
  const match = expires.match(/^(\d+)([smhd])$/)
  if (!match) return 30 * 24 * 60 * 60 * 1000

  const [, valueStr, unit] = match
  const value = parseInt(valueStr)
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 }

  return value * multipliers[unit as keyof typeof multipliers]
}
