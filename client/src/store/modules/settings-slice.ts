import { createSlice } from '@reduxjs/toolkit'
import { AdminPanelModelTab, AsideBarButtonName, Theme, UserSettings } from 'common-types'
import { setTheme } from 'src/utils'

const initialState: UserSettings = {
  asideTab: AsideBarButtonName.contacts,
  currentInfoId: '1',
  selectedChatRoomId: '',
  selectedAdminPanelModelTab: AdminPanelModelTab.users,
  theme: Theme.dark,
  soundOn: true,
  showTooltips: false,
  ableToShowNotification: true,
  showWallpaper: true,
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
        asideTab,
        selectedChatRoomId,
        theme,
        soundOn,
        showTooltips,
        ableToShowNotification,
        currentInfoId,
        showWallpaper,
        selectedAdminPanelModelTab
      } = payload
      state.asideTab = asideTab
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
    changeAsideTab(state, { payload }: { payload: AsideBarButtonName }) {
      state.asideTab = payload
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
      state.asideTab = AsideBarButtonName.contacts
      state.currentInfoId = '1'
      state.selectedChatRoomId = ''
      state.selectedAdminPanelModelTab = AdminPanelModelTab.users
      state.theme = Theme.dark
      state.soundOn = true
      state.showTooltips = false
      state.ableToShowNotification = true
      state.showWallpaper = true
    }
  }
})
