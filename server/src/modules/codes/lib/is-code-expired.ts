export const isCodeExpired = (expiresAtTimestampMs: number) => {
  return Date.now() >= expiresAtTimestampMs
}
