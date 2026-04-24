import type { IFrontendUserData } from 'global-shared'

export type DbUserDataType = Required<Pick<IFrontendUserData, 'id' | 'role' | 'email' | 'username'>>
