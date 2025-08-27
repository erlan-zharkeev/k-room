import { IFrontendUserData } from 'common-types'

export type DbUserDataType = Required<
  Pick<IFrontendUserData, 'id' | 'role' | 'email' | 'username' | 'infoNotifications'>
>
