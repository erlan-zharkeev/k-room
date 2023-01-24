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
    const response = await $api('post', UserEndPoints.UPDATE_USER_SETTINGS, dispatch, payload)
    dispatch(updateSettings(response.data))
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
    updateSettings(state, action) {
      const currentState = state
      const updatedSettings = action.payload
      state = {
        ...currentState,
        ...updatedSettings
      }
    },
    selectChatRoom(state, action) {
      state.selectedChatRoomId = action.payload
    },
    deselectChatRoom(state) {
      state.selectedChatRoomId = ''
    },
    changeAsideTab(state, action) {
      state.asideTab = action.payload
    },
    setAbleToShowNotification(state, action) {
      state.ableToShowNotification = action.payload
    },
    changeTheme(state, action) {
      state.theme = action.payload ? 'dark' : 'light'
      setTheme(state.theme)
    },
    setSoundValue(state, action) {
      state.soundOn = action.payload
    },
    setTooltipsValue(state, action) {
      state.showTooltips = action.payload
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
