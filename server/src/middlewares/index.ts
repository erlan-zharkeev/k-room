import rules from './authValidator/rules'
import jwtValidator from './accessTokenValidator'

export const middlewares = {
  authValidator: { rules },
  jwtValidator
}

export default middlewares
