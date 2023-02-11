import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserEndPoints } from 'common-types'
import $api from 'src/services/$api'
import setTheme from 'src/utils/setTheme'
import { SettingsState } from './@types/SettingsState'

export enum SettingsAction {
  UPDATE_USER_SETTINGS = 'UPDATE_USER_SETTINGS'
}

export const updateUserSettings = createAsyncThunk(
  SettingsAction.UPDATE_USER_SETTINGS,
  async (payload: { userId: string; type: string; value: string | boolean }, { dispatch }) => {
    await $api('post', UserEndPoints.UPDATE_USER_SETTINGS, dispatch, payload)
  }
)

const initialState: SettingsState = {
  asideTab: 'users',
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
    deselectChatRoom(state) {
      state.selectedChatRoomId = ''
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
  deselectChatRoom,
  setSoundValue,
  setTooltipsValue,
  selectChatRoom,
  setAbleToShowNotification,
  updateSettings
} = settingsSlice.actions

export default settingsSlice.reducer
