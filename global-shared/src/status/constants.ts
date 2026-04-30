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
