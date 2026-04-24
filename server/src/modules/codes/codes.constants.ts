export const CODE_LIFE_MS = 1000 * 60 * 15
export const RESEND_CODE_INTERVAL = 1000 * 60 * 3
export const QUERY_LIFE_MS = 1000 * 60 * 20

export const isCodeExpired = (value: number) => {
  return Date.now() >= value
}
