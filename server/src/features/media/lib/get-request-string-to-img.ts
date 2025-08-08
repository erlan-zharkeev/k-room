import { CommonEndpointsEnum } from 'common-types'
import { ENV } from 'shared-config'

export const getRequestStringToImg = (filename: string): string => {
  return `${ENV.SERVER_URL}${CommonEndpointsEnum.CommonImages}?img=${filename}`
}
