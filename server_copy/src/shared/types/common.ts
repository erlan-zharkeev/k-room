import { StatusEnum } from 'common-types'

export interface ErrorResponse<T> {
  message: T
  status: StatusEnum
  data: unknown
  silent: boolean
}
