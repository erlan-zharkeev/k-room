export const normalizeTimestamp = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') return null

  const timestampMs = Number.isNaN(Number(value)) ? new Date(value).getTime() : Number(value)

  return Number.isFinite(timestampMs) && timestampMs > 0 ? timestampMs : null
}
