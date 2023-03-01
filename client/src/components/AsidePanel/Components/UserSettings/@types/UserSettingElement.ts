import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { UserSettingName } from './UserSettingName'

export default interface UserSettingElement {
  name: UserSettingName
  method: ActionCreatorWithPayload<
    any,
    | 'settings/changeTheme'
    | 'settings/setSoundValue'
    | 'settings/setTooltipsValue'
    | 'settings/setAbleToShowNotification'
  >
}
