import { createSlice } from '@reduxjs/toolkit'
import setTheme from 'src/utils/setTheme'
import { SettingsState } from './@types/SettingsState'

const initialState: SettingsState = {
  asideTab: 'contacts',
  selectedChatRoomId: '',
  theme: 'dark',
  soundOn: true,
  showTooltips: false,
  ableToShowNotification: true
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings(state, { payload }) {
      const { asideTab, selectedChatRoomId, theme, soundOn, showTooltips, ableToShowNotification } = payload
      state.asideTab = asideTab
      state.selectedChatRoomId = selectedChatRoomId
      state.theme = theme
      setTheme(state.theme)
      state.soundOn = soundOn
      state.showTooltips = showTooltips
      state.ableToShowNotification = ableToShowNotification
    },
    selectChatRoom(state, { payload }) {
      state.selectedChatRoomId = payload
    },
    changeAsideTab(state, { payload }) {
      state.asideTab = payload
    },
    setAbleToShowNotification(state, { payload }) {
      state.ableToShowNotification = payload
    },
    changeTheme(state, { payload }) {
      state.theme = payload ? 'dark' : 'light'
      setTheme(state.theme)
    },
    setSoundValue(state, { payload }) {
      state.soundOn = payload
    },
    setTooltipsValue(state, { payload }) {
      state.showTooltips = payload
    }
  }
})

export const {
  changeAsideTab,
  changeTheme,
  setSoundValue,
  setTooltipsValue,
  selectChatRoom,
  setAbleToShowNotification,
  updateSettings
} = settingsSlice.actions

export default settingsSlice.reducer
