import { ENV } from '../ENV'
import { CommonEndPoints } from '../@types'

export const getRequestStringToImg = (filename: string): string => {
  return `${ENV.SERVER_URL}${CommonEndPoints.COMMON_IMAGES}?img=${filename}`
}
