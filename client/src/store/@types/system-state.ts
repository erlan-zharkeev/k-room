import { Message, NotificationMessage, NotificationType } from 'common-types'
import { ModalContentComponentName } from 'src/components'

export interface NotificationStore {
  key?: string
  message: NotificationMessage | JSX.Element
  description?: string
  messageType?: NotificationType
  duration?: number
  placement?: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
}

export type ContextMenuType = '' | 'message'

export enum ViewPortWidthType {
  desktop = 1200,
  tablet = 769,
  phone = 576
}

export interface ViewPort {
  width: number
  height: number
}

export interface ModalData {
  title: string
  modalContentComponentName: ModalContentComponentName
  okText?: string
  width?: string
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
