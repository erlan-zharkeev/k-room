import ENV from '../ENV'

export const getNextTimeCodeRequest = () => {
  const t = new Date()
  const interval = Number(ENV.NEXT_CODE_REQUEST_INTERVAL_SECONDS)
  return t.setSeconds(t.getSeconds() + interval)
}
