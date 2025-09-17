import { StatusEnum } from 'common-types'

export interface IDoRequestOpts<R> {
  contentType?: string
  responseType?: R
}

export interface IAxiosError {
  response: {
    status: StatusEnum
  }
}
