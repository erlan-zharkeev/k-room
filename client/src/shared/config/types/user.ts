import { IFrontendUserData } from 'common'

export type DbUserDataType = Required<
  Pick<IFrontendUserData, 'id' | 'role' | 'email' | 'username' | 'infoNotifications'>
>
