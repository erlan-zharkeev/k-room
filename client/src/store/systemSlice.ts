import { createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import { SystemStore } from './@types/SystemState'
import constants from 'src/constants'
import { duration } from 'moment'

const html = document.querySelector('html')

const clickedObjectInitialState = {
  message: {
    id: '',
    authorName: '',
    author: '',
    body: '',
    authorId: ''
  }
}

const initialState: SystemStore = {
  reconnecting: false,
  showModal: false,
  contextMenu: {
    slotName: '',
    coord: {
      x: 0,
      y: 0
    },
    contextClickedObject: clickedObjectInitialState
  },
  modalData: {
    title: '',
    modalContentComponentName: 'CreateMultipleChatPopup',
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
    setReconnectingStatus(state, { payload }) {
      state.reconnecting = payload
    },
    showModal(state, { payload }) {
      state.modalData = payload
      state.showModal = true
    },
    closeModal(state) {
      state.showModal = false
    },
    showNotification(state, { payload }) {
      const isError = state.notificationData.messageType === 'error'
      state.notificationData = {
        ...state.notificationData,
        ...payload,
        duration: isError ? constants.errorNotificationDuration : initialState.notificationData.duration
      }
      if (state.notificationData.messageType) notification[state.notificationData.messageType](state.notificationData)
      state.notificationData = initialState.notificationData
    },
    setViewPort(state, { payload }) {
      state.viewPort = payload
      const viewPortWidth = state.viewPort.width
      const viewPortType = viewPortWidth <= 576 ? 'mobile' : 'desktop'
      html?.setAttribute('view-port', viewPortType)
    },
    setContextMenu(state, { payload }) {
      const { event, type, contextClickedObject } = payload
      if (constants.blockNativeContextMenu && event) event.preventDefault()
      state.contextMenu.slotName = type
      if (!event) return
      const currentClickedObject = state.contextMenu.contextClickedObject
      state.contextMenu.contextClickedObject = { ...currentClickedObject, ...contextClickedObject }
      const viewportWidth = state.viewPort.width
      const viewportHeight = state.viewPort.width
      let x = event.pageX
      let y = event.pageY
      const defaultPadding = 4
      const menuDomElement = document.querySelector<HTMLElement>('.context-menu__body')
      if (!menuDomElement) return
      const menuWidth = menuDomElement.offsetWidth
      const menuHeight = menuDomElement.offsetHeight
      if (menuWidth + x > viewportWidth) x = viewportWidth - menuWidth - defaultPadding
      if (menuHeight + y > viewportHeight) y = viewportHeight - menuHeight - defaultPadding
      state.contextMenu.coord = {
        x,
        y
      }
    },
    resetContextClickedObject(state) {
      state.contextMenu.contextClickedObject = clickedObjectInitialState
    }
  }
})

export const {
  setReconnectingStatus,
  showNotification,
  showModal,
  closeModal,
  setViewPort,
  setContextMenu,
  resetContextClickedObject
} = systemSlice.actions

export default systemSlice.reducer
