import { Message } from 'common-types'

export interface NotificationStore {
  key: string
  message: string
  description: string
  messageType?: 'success' | 'error' | 'info' | 'warning'
  duration: number
  placement?: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
}

export type contextMenuType = '' | 'message'

export interface ViewPort {
  width: number
  height: number
}

export interface SystemStore {
  reconnecting: boolean
  showModal: boolean
  contextMenu: {
    slotName: contextMenuType
    coord: {
      x: number
      y: number
    }
    contextClickedObject: {
      message: Message
    }
  }
  modalData: {
    title: string
    modalContentComponentName: string
    okText: string
    width: string
  }
  notificationData: NotificationStore
  viewPort: ViewPort
}
