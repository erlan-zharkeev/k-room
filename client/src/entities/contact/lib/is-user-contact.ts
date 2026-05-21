import type { DbContactType, DbUserContactType } from 'src/shared/lib'

export const isUserContact = (contact: DbContactType): contact is DbUserContactType => !('isRoomMember' in contact)
