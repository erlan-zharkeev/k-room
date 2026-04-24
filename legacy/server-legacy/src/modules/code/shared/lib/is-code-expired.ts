export const isCodeExpired = (value: number): boolean => {
  return Date.now() >= value
}
