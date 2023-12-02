import { ENV } from '../ENV'

export const getTimeNextRequest = (): number =>
  Number(new Date(Date.now() + Number(ENV?.REGISTRATION_RESEND_INTERVAL_MINUTES) * 60000))
