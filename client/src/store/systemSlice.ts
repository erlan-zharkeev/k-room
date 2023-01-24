import { createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import { SystemStore } from './@types/SystemState'

const html = document.querySelector('html')

const initialState: SystemStore = {
  reconnecting: false,
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
  viewPort: {
    width: 0,
    height: 0
  }
}

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setReconnectingStatus(state, action) {
      state.reconnecting = action.payload
    },
    showModal(state, action) {
      state.modalData = action.payload
      state.showModal = true
    },
    closeModal(state) {
      state.showModal = false
    },
    showNotification(state, action) {
      const ableToShowNotification = action.payload.ableToShowNotification
      if (!ableToShowNotification) return
      delete action.payload.ableToShowNotification
      state.notificationData = {
        ...state.notificationData,
        ...action.payload
      }
      if (state.notificationData.messageType) notification[state.notificationData.messageType](state.notificationData)
      state.notificationData = initialState.notificationData
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
  setReconnectingStatus,
  showNotification,
  showModal,
  closeModal,
  setViewPort
} = systemSlice.actions

export default systemSlice.reducer
