import { SocketActions, Theme, UserSettingKey } from 'common-types'
import { UserSettingStoreActionPayload } from 'src/components/AsidePanel/Components/UserSettings/@types/UserSettingElement'
import { socket } from 'src/socket/socket'

export const changeSettingsHandler = (action: any, store: any) => {
  const isChangeSettingAction = action.type.includes('settings/') && action.type !== 'settings/updateSettings'
  if (isChangeSettingAction) {
    const value = action.payload
    let convertedValue = value
    const userId = store.getState().user.userData.id
    let type = ''
    switch (action.type) {
      case UserSettingStoreActionPayload.changeTheme:
        convertedValue = value ? Theme.dark : Theme.light
        type = UserSettingKey.theme
        break
      case UserSettingStoreActionPayload.setSoundValue:
        type = UserSettingKey.soundOn
        break
      case UserSettingStoreActionPayload.setTooltipsValue:
        type = UserSettingKey.showTooltips
        break
      case UserSettingStoreActionPayload.setAbleToShowNotification:
        type = UserSettingKey.ableToShowNotification
        break
      case UserSettingStoreActionPayload.selectChatRoom:
        type = UserSettingKey.selectedChatRoomId
        break
      case UserSettingStoreActionPayload.changeAsideTab:
        type = UserSettingKey.asideTab
        break
      case UserSettingStoreActionPayload.setCurrentInfoItem:
        type = UserSettingKey.currentInfoId
        break
      default:
        break
    }
    socket.emit(SocketActions.UPDATE_USER_SETTINGS, { userId, type, value: convertedValue })
  }
}

export default changeSettingsHandler
