export type theme = 'dark' | 'light'

export interface NotificationStore {
  key: string
  message: string
  description: string
  messageType?: 'success' | 'error' | 'info' | 'warning'
  duration: number
  placement?: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
}

export interface ViewPort {
  width: number
  height: number
}

export interface SystemStore {
  socketConnected: boolean
  ableToShowNotification: boolean
  showModal: boolean
  modalData: {
    title: string
    modalContentComponentName: string
    okText: string
    width: string
  }
  notificationData: NotificationStore
  theme: theme
  showTooltips: boolean
  soundOn: boolean
  asideTab: string
  viewPort: ViewPort
}
