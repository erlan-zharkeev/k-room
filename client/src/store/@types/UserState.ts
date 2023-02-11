import { User } from 'common-types'

export interface UserState {
  isAppLoading: boolean
  isAuth: boolean
  userData: User
}
