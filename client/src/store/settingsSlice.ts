import { createSlice } from '@reduxjs/toolkit'
import setTheme from 'src/utils/setTheme'
import { Theme, UserSettings } from 'common-types'

const initialState: UserSettings = {
  asideTab: 'contacts',
  currentInfoId: '1',
  selectedChatRoomId: '',
  theme: Theme.dark,
  soundOn: true,
  showTooltips: false,
  ableToShowNotification: true
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrentInfoItem(state, { payload }) {
      state.currentInfoId = payload
    },
    updateSettings(state, { payload }) {
      if (!payload) return
      const { asideTab, selectedChatRoomId, theme, soundOn, showTooltips, ableToShowNotification, currentInfoId } =
        payload
      state.asideTab = asideTab
      state.selectedChatRoomId = selectedChatRoomId
      state.theme = theme
      setTheme(state.theme)
      state.soundOn = soundOn
      state.showTooltips = showTooltips
      state.currentInfoId = currentInfoId
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
      state.theme = payload ? Theme.dark : Theme.light
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
  updateSettings,
  setCurrentInfoItem
} = settingsSlice.actions

export default settingsSlice.reducer
