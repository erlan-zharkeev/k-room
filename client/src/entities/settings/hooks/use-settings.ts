import {
  IUserSettings,
  ContentTabType,
  AdminPanelModelTabType,
  IEventUpdateUserSettings,
  ThemeType,
  SocketActionsType
} from 'common-types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { socket } from 'src/shared/api'
import {
  setSoundValue,
  setTooltipsValue,
  setAbleToShowNotification,
  showWallpaper,
  selectChatRoom,
  changeSelectedContentElement,
  setCurrentInfoItem,
  setAdminPanelTab
} from '../model'
import { useTypedSelector } from 'src/shared/lib'

export const useSettings = () => {
  const { selectedContentElement, selectedChatRoomId, soundOn, currentInfoId, theme } = useTypedSelector(
    (state) => state.persist.settings
  )

  const dispatch = useDispatch<AppDispatch>()

  const updateSetting = (
    type: keyof IUserSettings,
    value: {
      commonSettings?: boolean
      selectedContentElement?: ContentTabType
      infoId?: string
      selectChatRoomId?: string
      selectedAdminPanelModelTab?: AdminPanelModelTabType
      theme?: ThemeType
    }
  ) => {
    const payload: IEventUpdateUserSettings = {
      type,
      value: ''
    }
    switch (type) {
      case 'theme':
        payload.value = value.theme ?? 'dark'
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
        // scrollToBottom()
        break
      case 'selectedContentElement':
        if (value.selectedContentElement === undefined) return
        payload.value = value.selectedContentElement
        dispatch(changeSelectedContentElement(value.selectedContentElement))
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
    socket.emit<SocketActionsType>('update-user-settings', payload)
  }

  const changeContentTabSelection = (value: ContentTabType) => {
    updateSetting('selectedContentElement', { selectedContentElement: value })
  }

  return {
    changeContentTabSelection,
    updateSetting,
    selectedContentElement,
    selectedChatRoomId,
    soundOn,
    currentInfoId,
    theme
  }
}
