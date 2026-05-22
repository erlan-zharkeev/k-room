import { IFrontendUserData } from 'common'

export type DbUserData = Required<Pick<IFrontendUserData, 'id' | 'role' | 'email' | 'username'>>
