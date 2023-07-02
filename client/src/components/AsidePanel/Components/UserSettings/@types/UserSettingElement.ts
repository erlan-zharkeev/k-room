import { UserSettingName } from './UserSettingName'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'

export enum UserSettingStoreActionPayload {
  changeTheme = 'settings/changeTheme',
  setSoundValue = 'settings/setSoundValue',
  setTooltipsValue = 'settings/setTooltipsValue',
  setAbleToShowNotification = 'settings/setAbleToShowNotification',
  selectChatRoom = 'settings/selectChatRoom',
  changeAsideTab = 'settings/changeAsideTab',
  setCurrentInfoItem = 'settings/setCurrentInfoItem'
}

export interface UserSettingElement {
  name: UserSettingName
  method: ActionCreatorWithPayload<any, string>
}
