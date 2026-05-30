export const REQ_STATUS = {
  success: 200,
  badRequest: 400,
  notAuth: 401,
  forbidden: 403,
  notFound: 404,
  tooManyRequests: 429,
  server: 500,
  unreachable: 503,
  badGateway: 504
} as const
export const HTTP_SUCCESS_STATUS_MIN = 200
export const HTTP_SUCCESS_STATUS_MAX = 299
export const HTTP_REDIRECT_STATUS_MIN = 300
export const HTTP_REDIRECT_STATUS_MAX = 399
