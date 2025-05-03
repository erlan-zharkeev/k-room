import { createSlice } from '@reduxjs/toolkit'
import { ThemeType, IUserSettings, ContentTabType } from 'common-types'

const initialState: IUserSettings = {
  selectedContentTab: 'contacts',
  selectedChatRoomId: '',
  theme: 'dark',
  soundOn: true,
  showTooltips: false,
  showNotification: true,
  showWallpaper: true,
  selectedAudioInputDeviceId: '',
  selectedVideoInputDeviceId: '',
  selectedAudioOutputDeviceId: ''
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings(state, { payload }: { payload: IUserSettings }) {
      if (!payload) return
      const { selectedContentTab, selectedChatRoomId, theme, soundOn, showTooltips, showNotification, showWallpaper } =
        payload
      state.selectedContentTab = selectedContentTab
      state.selectedChatRoomId = selectedChatRoomId
      state.theme = theme
      state.soundOn = soundOn
      state.showTooltips = showTooltips
      state.showNotification = showNotification
      state.showWallpaper = showWallpaper
    },
    updateSelectedAudioInputDeviceId: (state, { payload }: { payload: string }) => {
      state.selectedAudioInputDeviceId = payload
    },
    updateSelectedVideoInputDeviceId: (state, { payload }: { payload: string }) => {
      state.selectedVideoInputDeviceId = payload
    },
    updateSelectedAudioOutputDeviceId: (state, { payload }: { payload: string }) => {
      state.selectedAudioOutputDeviceId = payload
    },
    selectChatRoom(state, { payload }: { payload: string }) {
      state.selectedChatRoomId = payload
    },
    changeSelectedContentElement(state, { payload }: { payload: ContentTabType }) {
      state.selectedContentTab = payload
    },
    setAbleToShowNotification(state, { payload }: { payload: boolean }) {
      state.showNotification = payload
    },
    changeTheme(state, { payload }: { payload: ThemeType }) {
      state.theme = payload
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
      state.selectedContentTab = 'contacts'
      state.selectedChatRoomId = ''
      state.theme = 'dark'
      state.soundOn = true
      state.showTooltips = false
      state.showNotification = true
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
  showWallpaper,
  resetSettings,
  updateSelectedAudioOutputDeviceId,
  updateSelectedAudioInputDeviceId,
  updateSelectedVideoInputDeviceId
} = settingsSlice.actions
