import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import { UserEndPoints } from 'common-types'
import ENV from 'src/ENV'
import $api from 'src/services/api'
import setTheme from 'src/utils/setTheme'
import { SystemStore } from './@types/SystemState'

const html = document.querySelector('html')

export enum SystemAction {
  UPDATE_USER_SETTINGS = 'UPDATE_USER_SETTINGS'
}

export const updateUserSettings = createAsyncThunk(
  SystemAction.UPDATE_USER_SETTINGS,
  async (payload: { userId: string; type: string; value: string | boolean }, { dispatch }) => {
    const response = await $api('post', UserEndPoints.UPDATE_USER_SETTINGS, dispatch, payload)
    dispatch(updateSettings(response.data))
  }
)

const initialState: SystemStore = {
  socketConnected: false,
  reconnectAttempts: ENV.MAX_RECONNECT_ATTEMPTS,
  showModal: false,
  modalData: {
    title: '',
    modalContentComponentName: '',
    okText: 'ok',
    width: '320px'
  },
  notificationData: {
    key: '',
    message: '',
    description: '',
    messageType: 'info',
    duration: 3,
    placement: 'top'
  },
  asideTab: 'users',
  selectedChatRoomId: '',
  viewPort: {
    width: 0,
    height: 0
  },
  settings: {
    theme: 'dark',
    soundOn: true,
    showTooltips: false,
    ableToShowNotification: true
  }
}

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    socketConnect(state) {
      state.socketConnected = true
      state.reconnectAttempts = ENV.MAX_RECONNECT_ATTEMPTS
    },
    setReconnectionAttempts(state) {
      state.reconnectAttempts = state.reconnectAttempts - 1
      console.log(state.reconnectAttempts)
    },
    socketDisconnect(state) {
      state.socketConnected = false
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
    showModal(state, action) {
      state.modalData = action.payload
      state.showModal = true
    },
    closeModal(state) {
      state.showModal = false
    },
    setAbleToShowNotification(state, action) {
      state.settings.ableToShowNotification = action.payload
    },
    showNotification(state, action) {
      if (!state.settings.ableToShowNotification) return
      state.notificationData = {
        ...state.notificationData,
        ...action.payload
      }
      if (state.notificationData.messageType) notification[state.notificationData.messageType](state.notificationData)
      state.notificationData = initialState.notificationData
    },
    changeTheme(state, action) {
      state.settings.theme = action.payload ? 'dark' : 'light'
      setTheme(state.settings.theme)
    },
    setSoundValue(state, action) {
      state.settings.soundOn = action.payload
    },
    setTooltipsValue(state, action) {
      state.settings.showTooltips = action.payload
    },
    setViewPort(state, action) {
      state.viewPort = action.payload
      const viewPortWidth = state.viewPort.width
      const viewPortType = viewPortWidth <= 576 ? 'mobile' : 'desktop'
      html?.setAttribute('view-port', viewPortType)
    },
    updateSettings(state, action) {
      const currentSettings = state.settings
      const updatedSettings = action.payload
      state.settings = {
        ...currentSettings,
        ...updatedSettings
      }
    }
  }
})

export const {
  socketConnect,
  setReconnectionAttempts,
  showNotification,
  socketDisconnect,
  deselectChatRoom,
  showModal,
  closeModal,
  changeAsideTab,
  changeTheme,
  setSoundValue,
  setTooltipsValue,
  setViewPort,
  selectChatRoom,
  setAbleToShowNotification,
  updateSettings
} = systemSlice.actions

export default systemSlice.reducer
