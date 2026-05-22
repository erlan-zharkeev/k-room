import { IImageObject, IRepliedMessage } from 'common'

import { ContextMenu } from 'src/shared/context-menu'

export interface ViewPort {
  width: number
  height: number
}

export const VIEW_PORT_WIDTH = {
  Desktop: 1200,
  Tablet: 769,
  Phone: 576
} as const

export type AuthStatus = 'authorized' | 'unauthorized' | 'loading'

export interface MessageInputData {
  body: string
  images: IImageObject[]
  imageCompression: boolean
}

export interface SystemStore {
  auth: AuthStatus
  online: boolean
  reconnecting: boolean
  contextMenu: ContextMenu
  viewPort: ViewPort
  hasInteracted: boolean
  camPermission?: PermissionState
  micPermission?: PermissionState
  repliedMessageData: IRepliedMessage
  messageInputData: MessageInputData
}
