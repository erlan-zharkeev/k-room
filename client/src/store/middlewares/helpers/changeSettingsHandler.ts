import { SocketActions, Theme } from 'common-types'
import { socket } from 'src/socket/socket'

export const changeSettingsHandler = (action: any, store: any) => {
  const isChangeSettingAction = action.type.includes('settings/') && action.type !== 'settings/updateSettings'
  if (isChangeSettingAction) {
    const value = action.payload
    let convertedValue = value
    const userId = store.getState().user.userData.id
    let type = ''
    switch (action.type) {
      case 'settings/changeTheme':
        convertedValue = value ? Theme.dark : Theme.light
        type = 'theme'
        break
      case 'settings/setSoundValue':
        type = 'soundOn'
        break
      case 'settings/setTooltipsValue':
        type = 'showTooltips'
        break
      case 'settings/setAbleToShowNotification':
        type = 'ableToShowNotification'
        break
      case 'settings/selectChatRoom':
        type = 'selectedChatRoomId'
        break
      case 'settings/changeAsideTab':
        type = 'asideTab'
        break
      case 'settings/setCurrentInfoItem':
        type = 'currentInfoId'
        break
      default:
        break
    }
    socket.emit(SocketActions['update-user-settings'], { userId, type, value: convertedValue })
  }
}

export default changeSettingsHandler
