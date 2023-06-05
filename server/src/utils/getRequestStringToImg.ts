import { CommonEndPoints } from './../../../types'
import ENV from '../ENV'

export const getRequestStringToImg = (filename: string): string => {
  return `${ENV.SERVER_URL}${CommonEndPoints.COMMON_IMAGES}?img=${filename}`
}
