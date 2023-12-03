import { createSlice } from '@reduxjs/toolkit'
import { notification } from 'antd'
import {
  ContextClickedObject,
  ContextMenuType,
  ModalData,
  NotificationStore,
  SystemStore,
  ViewPort,
  ViewPortWidthType
} from './@types/system-state'
import { clientConstants } from 'src/client-constants'
import { NotificationMessage, NotificationType } from 'common-types'
import { ModalContentComponentName } from 'src/components'

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
    modalContentComponentName: ModalContentComponentName.createMultipleChatPopup,
    okText: 'ok',
    width: '320px'
  },
  notificationData: {
    key: '',
    message: NotificationMessage.default,
    description: '',
    messageType: NotificationType.info,
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
    setReconnectingStatus(state, { payload }: { payload: boolean }) {
      state.reconnecting = payload
    },
    showModal(state, { payload }: { payload: ModalData }) {
      state.modalData = payload
      state.showModal = true
    },
    closeModal(state) {
      state.showModal = false
    },
    showNotification(state, { payload }: { payload: NotificationStore }) {
      const isError = state.notificationData.messageType === NotificationType.error
      state.notificationData = {
        ...state.notificationData,
        ...payload,
        duration: isError ? clientConstants.errorNotificationDuration : initialState.notificationData.duration
      }
      if (state.notificationData.messageType) notification[state.notificationData.messageType](state.notificationData)
      state.notificationData = initialState.notificationData
    },
    setViewPort(state, { payload }: { payload: ViewPort }) {
      state.viewPort = payload
      const viewPortWidth = state.viewPort.width
      const viewPortType = viewPortWidth <= ViewPortWidthType.phone ? 'mobile' : 'desktop'
      html?.setAttribute('view-port', viewPortType)
    },
    setContextMenu(
      state,
      {
        payload
      }: {
        payload: {
          event: React.MouseEvent<HTMLDivElement, MouseEvent> | null
          type: ContextMenuType
          contextClickedObject?: ContextClickedObject
        }
      }
    ) {
      const { event, type, contextClickedObject } = payload
      if (clientConstants.blockNativeContextMenu && event) event.preventDefault()
      state.contextMenu.slotName = type
      if (!event) return
      const currentClickedObject = state.contextMenu.contextClickedObject
      state.contextMenu.contextClickedObject = { ...currentClickedObject, ...contextClickedObject }
      const viewportWidth = state.viewPort.width
      const viewportHeight = state.viewPort.height
      let x = event.pageX
      let y = event.pageY
      const defaultPadding = 4
      const menuWidth = clientConstants.dimensions.contextMenuWidth
      const menuHeight = clientConstants.dimensions.contextMenuHeight
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
