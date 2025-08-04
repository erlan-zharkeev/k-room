import { ENV } from '../app/config/constants'

export const getTimeNextRequest = (): number =>
  Number(new Date(Date.now() + Number(ENV?.REGISTRATION_RESEND_INTERVAL_MINUTES) * 60000))
