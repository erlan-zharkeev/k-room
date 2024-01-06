import { UserSettingKey, Theme, SocketActionsPayload, SocketActions, AsideBarButtonName } from 'common-types'
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
  showWallpaper
} from 'src/store'
import { $socket } from 'src/services/$socket'
import { scrollToBottom } from 'src/utils'

export const useUpdateSettings = () => {
  const dispatch = useDispatch<AppDispatch>()

  const updateSetting = (
    type: UserSettingKey,
    value: {
      commonSettings?: boolean
      asideTab?: AsideBarButtonName
      infoId?: string
      selectChatRoomId?: string
    }
  ) => {
    const payload: SocketActionsPayload['updateUserSettings'] = {
      type,
      value: ''
    }
    switch (type) {
      case UserSettingKey.theme:
        payload.value = value.commonSettings ? Theme.dark : Theme.light
        dispatch(changeTheme(payload.value as Theme))
        break
      case UserSettingKey.soundOn:
        payload.value = Boolean(value.commonSettings)
        dispatch(setSoundValue(payload.value))
        break
      case UserSettingKey.showTooltips:
        payload.value = Boolean(value.commonSettings)
        dispatch(setTooltipsValue(payload.value))
        break
      case UserSettingKey.ableToShowNotification:
        payload.value = Boolean(value.commonSettings)
        dispatch(setAbleToShowNotification(payload.value))
        break
      case UserSettingKey.showWallpaper:
        payload.value = Boolean(value.commonSettings)
        dispatch(showWallpaper(payload.value))
        break
      case UserSettingKey.selectedChatRoomId:
        if (value.selectChatRoomId === undefined) return
        payload.value = value.selectChatRoomId
        dispatch(selectChatRoom(value.selectChatRoomId))
        scrollToBottom()
        break
      case UserSettingKey.asideTab:
        if (value.asideTab === undefined) return
        payload.value = value.asideTab
        dispatch(changeAsideTab(value.asideTab))
        break
      case UserSettingKey.currentInfoId:
        if (value.infoId === undefined) return
        payload.value = value.infoId
        dispatch(setCurrentInfoItem(value.infoId))
        break
      default:
        break
    }
    if (!type) return
    $socket.emit(SocketActions.UPDATE_USER_SETTINGS, payload)
  }
  return { updateSetting }
}
