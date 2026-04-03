export const normalizeTimestamp = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') return null

  const timestamp = Number.isNaN(Number(value)) ? new Date(value).getTime() : Number(value)

  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null
}
