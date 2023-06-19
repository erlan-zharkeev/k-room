import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { UserSettingName } from './UserSettingName'

export interface UserSettingElement {
  name: UserSettingName
  method: ActionCreatorWithPayload<
  any,
  | 'settings/changeTheme'
  | 'settings/setSoundValue'
  | 'settings/setTooltipsValue'
  | 'settings/setAbleToShowNotification'
  >
}
