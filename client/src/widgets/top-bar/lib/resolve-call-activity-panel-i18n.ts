import { CALL_ACTIVITY_PANEL_KIND } from '../config/constants'
import { CALL_ACTIVITY_PANEL_I18N } from '../config/i18n'
import type { ResolveCallActivityPanelI18nParams } from '../config/types'

export const resolveCallActivityPanelI18n = ({ isPrivateRoom, kind }: ResolveCallActivityPanelI18nParams) => {
  if (kind === CALL_ACTIVITY_PANEL_KIND.INCOMING && isPrivateRoom) {
    return CALL_ACTIVITY_PANEL_I18N.incomingPrivateRoomCall
  }

  if (kind === CALL_ACTIVITY_PANEL_KIND.INCOMING) return CALL_ACTIVITY_PANEL_I18N.incomingGroupRoomCall
  if (kind === CALL_ACTIVITY_PANEL_KIND.OUTGOING) return CALL_ACTIVITY_PANEL_I18N.outgoingRoomCall
  if (kind === CALL_ACTIVITY_PANEL_KIND.ACTIVE) return CALL_ACTIVITY_PANEL_I18N.activeRoomCall

  return CALL_ACTIVITY_PANEL_I18N.joinableRoomCall
}
