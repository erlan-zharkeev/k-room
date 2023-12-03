import { KRoomUser } from 'common-types'

export interface UserState {
  isAppLoading: boolean
  isAuth: boolean
  userData: KRoomUser
}
