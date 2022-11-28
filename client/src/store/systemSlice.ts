import { createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import setTheme from '../utils/setTheme'
import { SystemStore } from './@types/SystemState'

const html = document.querySelector('html')

const initialState: SystemStore = {
  socketConnected: false,
  showModal: false,
  modalData: {
    title: '',
    modalContentComponentName: '',
    okText: 'ok',
    width: '320px'
  },
  ableToShowNotification: false,
  notificationData: {
    key: '',
    message: '',
    description: '',
    messageType: 'info',
    duration: 3,
    placement: 'top'
  },
  theme: 'dark',
  soundOn: true,
  showTooltips: false,
  asideTab: 'users',
  viewPort: {
    width: 0,
    height: 0
  }
}

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    socketConnect(state) {
      state.socketConnected = true
    },
    socketDisconnect(state) {
      state.socketConnected = false
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
      state.ableToShowNotification = action.payload
    },
    showNotification(state, action) {
      if (!state.ableToShowNotification) return
      state.notificationData = {
        ...state.notificationData,
        ...action.payload
      }
      if (state.notificationData.messageType) notification[state.notificationData.messageType](state.notificationData)
      state.notificationData = initialState.notificationData
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
    },
    setViewPort(state, action) {
      state.viewPort = action.payload
      const viewPortWidth = state.viewPort.width
      const viewPortType = viewPortWidth <= 576 ? 'mobile' : 'desktop'
      html?.setAttribute('view-port', viewPortType)
    }
  }
})

export const {
  socketConnect,
  showNotification,
  socketDisconnect,
  showModal,
  closeModal,
  changeAsideTab,
  changeTheme,
  setSoundValue,
  setTooltipsValue,
  setViewPort,
  setAbleToShowNotification
} = systemSlice.actions

export default systemSlice.reducer
