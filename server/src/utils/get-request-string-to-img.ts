import { ENV } from '../ENV'
import { CommonEndpoints } from '../@types'

export const getRequestStringToImg = (filename: string): string => {
  return `${ENV.SERVER_URL}${CommonEndpoints.CommonImages}?img=${filename}`
}
