import { User } from './../../../../types'

export interface AuthState {
  isAuth: boolean
  userData: User
}