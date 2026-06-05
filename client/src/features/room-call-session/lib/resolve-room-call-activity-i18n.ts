import { ROOM_CALL_ACTIVITY_I18N_BY_KIND, ROOM_CALL_ACTIVITY_KIND } from '../config/constants'
import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { ResolveRoomCallActivityI18nParams } from '../config/types'

export const resolveRoomCallActivityI18n = ({ isPrivateRoom, kind }: ResolveRoomCallActivityI18nParams) => {
  if (kind === ROOM_CALL_ACTIVITY_KIND.INCOMING && isPrivateRoom) {
    return ROOM_CALL_SESSION_I18N.incomingPrivateRoomCall
  }

  return ROOM_CALL_ACTIVITY_I18N_BY_KIND[kind]
}
