import { createSlice } from '@reduxjs/toolkit'
import { AdminPanelModelTab, Theme, UserSettings, SelectedContentElement } from 'common-types'
import { setTheme } from 'src/shared/utils'

const initialState: UserSettings = {
  selectedContentElement: 'contacts',
  currentInfoId: '1',
  selectedChatRoomId: '',
  selectedAdminPanelModelTab: 'users',
  theme: 'dark',
  soundOn: true,
  showTooltips: false,
  ableToShowNotification: true,
  showWallpaper: true
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrentInfoItem(state, { payload }: { payload: string }) {
      state.currentInfoId = payload
    },
    updateSettings(state, { payload }: { payload: UserSettings }) {
      if (!payload) return
      const {
        selectedContentElement,
        selectedChatRoomId,
        theme,
        soundOn,
        showTooltips,
        ableToShowNotification,
        currentInfoId,
        showWallpaper,
        selectedAdminPanelModelTab
      } = payload
      state.selectedContentElement = selectedContentElement
      state.selectedChatRoomId = selectedChatRoomId
      state.theme = theme
      setTheme(state.theme)
      state.soundOn = soundOn
      state.showTooltips = showTooltips
      state.currentInfoId = currentInfoId
      state.ableToShowNotification = ableToShowNotification
      state.showWallpaper = showWallpaper
      state.selectedAdminPanelModelTab = selectedAdminPanelModelTab
    },
    setAdminPanelTab(state, { payload }: { payload: AdminPanelModelTab }) {
      state.selectedAdminPanelModelTab = payload
    },
    selectChatRoom(state, { payload }: { payload: string }) {
      state.selectedChatRoomId = payload
    },
    changeSelectedContentElement(state, { payload }: { payload: SelectedContentElement }) {
      state.selectedContentElement = payload
    },
    setAbleToShowNotification(state, { payload }: { payload: boolean }) {
      state.ableToShowNotification = payload
    },
    changeTheme(state, { payload }: { payload: Theme }) {
      state.theme = payload
      setTheme(state.theme)
    },
    setSoundValue(state, { payload }: { payload: boolean }) {
      state.soundOn = payload
    },
    setTooltipsValue(state, { payload }: { payload: boolean }) {
      state.showTooltips = payload
    },
    showWallpaper(state, { payload }: { payload: boolean }) {
      state.showWallpaper = payload
    },
    resetSettings(state) {
      state.selectedContentElement = 'contacts'
      state.currentInfoId = '1'
      state.selectedChatRoomId = ''
      state.selectedAdminPanelModelTab = 'users'
      state.theme = 'dark'
      state.soundOn = true
      state.showTooltips = false
      state.ableToShowNotification = true
      state.showWallpaper = true
    }
  }
})

export const {
  changeSelectedContentElement,
  changeTheme,
  setSoundValue,
  setTooltipsValue,
  selectChatRoom,
  setAbleToShowNotification,
  updateSettings,
  setCurrentInfoItem,
  showWallpaper,
  resetSettings,
  setAdminPanelTab
} = settingsSlice.actions
