import {
  HTTP_REDIRECT_STATUS_MAX,
  HTTP_REDIRECT_STATUS_MIN,
  HTTP_SUCCESS_STATUS_MAX,
  HTTP_SUCCESS_STATUS_MIN
} from '../constants'

export const isHttpSuccessStatus = (status: number) =>
  status >= HTTP_SUCCESS_STATUS_MIN && status <= HTTP_SUCCESS_STATUS_MAX

export const isHttpRedirectStatus = (status: number) =>
  status >= HTTP_REDIRECT_STATUS_MIN && status <= HTTP_REDIRECT_STATUS_MAX
