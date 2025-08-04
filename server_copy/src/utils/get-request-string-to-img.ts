import { ENV } from '../app/config/constants'
import { CommonEndpointsEnum } from 'common-types'

export const getRequestStringToImg = (filename: string): string => {
  return `${ENV.SERVER_URL}${CommonEndpointsEnum.CommonImages}?img=${filename}`
}
