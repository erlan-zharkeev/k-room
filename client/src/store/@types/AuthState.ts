import { User } from 'common-types'

export interface AuthState {
  isAuth: boolean
  userData: User
}