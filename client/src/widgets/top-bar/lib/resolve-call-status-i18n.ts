import { CALL_STATUS_KIND } from '../config/constants'
import { CALL_STATUS_I18N } from '../config/i18n'
import type { ResolveCallStatusI18nParams } from '../config/types'

export const resolveCallStatusI18n = ({ isPrivateRoom, kind }: ResolveCallStatusI18nParams) => {
  if (kind === CALL_STATUS_KIND.INCOMING && isPrivateRoom) return CALL_STATUS_I18N.incomingPrivateRoomCall
  if (kind === CALL_STATUS_KIND.INCOMING) return CALL_STATUS_I18N.incomingGroupRoomCall
  if (kind === CALL_STATUS_KIND.OUTGOING) return CALL_STATUS_I18N.outgoingRoomCall
  if (kind === CALL_STATUS_KIND.ACTIVE) return CALL_STATUS_I18N.activeRoomCall

  return CALL_STATUS_I18N.joinableRoomCall
}
