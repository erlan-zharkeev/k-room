import { IFrontendUserData } from 'common-types'

export type StoreUserData = Required<
  Pick<
    IFrontendUserData,
    | 'id'
    | 'role'
    | 'email'
    | 'username'
    | 'online'
    | 'chatRooms'
    | 'contacts'
    | 'avatar'
    | 'provider'
    | 'infoNotifications'
  >
>

export interface IUserStore {
  isAuth: boolean
  userData: StoreUserData
}
