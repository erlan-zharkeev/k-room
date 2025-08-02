import { IUserData } from 'common-types'

export type StoreUserData = Required<
  Pick<
    IUserData,
    | 'id'
    | 'role'
    | 'email'
    | 'username'
    | 'online'
    | 'chatRooms'
    | 'contacts'
    | 'avatarPath'
    | 'providerName'
    | 'infoNotifications'
  >
>

export interface IUserStore {
  isAuth: boolean
  userData: StoreUserData
}
