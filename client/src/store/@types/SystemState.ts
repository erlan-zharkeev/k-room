import { Message, NotificationType } from 'common-types'

export interface NotificationStore {
  key: string
  message: string
  description: string
  messageType?: NotificationType
  duration: number
  placement?: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
}

export type ContextMenuType = '' | 'message'

export interface ViewPort {
  width: number
  height: number
}

export interface ModalData {
  title: string
  modalContentComponentName: string
  okText: string
  width: string
}

export interface ContextMenu {
  slotName: ContextMenuType
  coord: {
    x: number
    y: number
  }
  contextClickedObject: ContextClickedObject
}

export interface ContextClickedObject {
  message: Message
}

export interface SystemStore {
  reconnecting: boolean
  showModal: boolean
  contextMenu: ContextMenu
  modalData: ModalData
  notificationData: NotificationStore
  viewPort: ViewPort
}
