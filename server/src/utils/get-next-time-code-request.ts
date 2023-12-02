export const getNextTimeCodeRequest = (interval: number | string) => {
  const date = new Date()
  return date.setSeconds(date.getSeconds() + Number(interval))
}
