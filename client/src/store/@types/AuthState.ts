import { User } from 'common-types'

export interface AuthState {
  isAppLoading: boolean
  isAuth: boolean
  userData: User
}
