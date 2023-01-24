import { updateUserSettings } from "src/store/settingsSlice"

export const changeSettingsHandler = (action: any, store: any, dispatch: any) => {
  const isChangeSettingAction = action.type.includes('settings/') && action.type !== 'settings/updateSettings'
  if (isChangeSettingAction) {
    const value = action.payload
    let convertedValue = value
    const userId = store.getState().user.userData.id
    let type = null
    switch (action.type) {
      case 'settings/changeTheme':
        convertedValue = value ? 'dark' : 'light'
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
      case 'settings/deselectChatRoom':
        type = 'selectedChatRoomId'
        break
      case 'settings/changeAsideTab':
        type = 'asideTab'
        break
      default:
        break
    }
    dispatch(updateUserSettings({userId, type, value }))
  }
}

export default changeSettingsHandler