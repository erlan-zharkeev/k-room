import { AxiosResponse } from 'axios'
import { EndpointsType } from 'common-types'

export type RequestTypes = 'post' | 'get' | 'patch' | 'put' | 'delete' | 'head'

export type DoRequest = (
  type: RequestTypes,
  endpoint: EndpointsType,
  data?: any,
  contentType?: string
) => Promise<AxiosResponse<any, any> | undefined>
