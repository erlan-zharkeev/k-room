import {
  Theme,
  SocketActions,
  AdminPanelModelTab,
  UserSettings,
  AsideBarButtonName,
  EventUpdateUserSettings
} from 'common-types'
import { useDispatch } from 'react-redux'
import {
  AppDispatch,
  changeAsideTab,
  changeTheme,
  selectChatRoom,
  setAbleToShowNotification,
  setCurrentInfoItem,
  setSoundValue,
  setTooltipsValue,
  showWallpaper,
  setAdminPanelTab
} from 'src/store'
import { $socket } from 'src/services/$socket'
import { scrollToBottom } from 'src/utils'

export const useUpdateSettings = () => {
  const dispatch = useDispatch<AppDispatch>()

  const updateSetting = (
    type: keyof UserSettings,
    value: {
      commonSettings?: boolean
      asideTab?: AsideBarButtonName
      infoId?: string
      selectChatRoomId?: string
      selectedAdminPanelModelTab?: AdminPanelModelTab
    }
  ) => {
    const payload: EventUpdateUserSettings = {
      type,
      value: ''
    }
    switch (type) {
      case 'theme':
        payload.value = value.commonSettings ? 'dark' : 'light'
        dispatch(changeTheme(payload.value as Theme))
        break
      case 'soundOn':
        payload.value = Boolean(value.commonSettings)
        dispatch(setSoundValue(payload.value))
        break
      case 'showTooltips':
        payload.value = Boolean(value.commonSettings)
        dispatch(setTooltipsValue(payload.value))
        break
      case 'ableToShowNotification':
        payload.value = Boolean(value.commonSettings)
        dispatch(setAbleToShowNotification(payload.value))
        break
      case 'showWallpaper':
        payload.value = Boolean(value.commonSettings)
        dispatch(showWallpaper(payload.value))
        break
      case 'selectedChatRoomId':
        if (value.selectChatRoomId === undefined) return
        payload.value = value.selectChatRoomId
        dispatch(selectChatRoom(value.selectChatRoomId))
        scrollToBottom()
        break
      case 'asideTab':
        if (value.asideTab === undefined) return
        payload.value = value.asideTab
        dispatch(changeAsideTab(value.asideTab))
        break
      case 'currentInfoId':
        if (value.infoId === undefined) return
        payload.value = value.infoId
        dispatch(setCurrentInfoItem(value.infoId))
        break
      case 'selectedAdminPanelModelTab':
        if (value.selectedAdminPanelModelTab === undefined) return
        payload.value = value.selectedAdminPanelModelTab
        dispatch(setAdminPanelTab(value.selectedAdminPanelModelTab))
        break
      default:
        break
    }
    if (!type) return
    $socket.emit<SocketActions>('update-user-settings', payload)
  }
  return { updateSetting }
}
