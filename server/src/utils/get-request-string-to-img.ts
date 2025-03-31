import { ENV } from '../ENV'
import { CommonEndpointsEnum } from '../@types'

export const getRequestStringToImg = (filename: string): string => {
  return `${ENV.SERVER_URL}${CommonEndpointsEnum.CommonImages}?img=${filename}`
}
