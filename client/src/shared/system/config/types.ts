import { IImageObject, IRepliedMessage } from 'common'

import { IContextMenu } from 'src/shared/context-menu'

export interface IViewPort {
  width: number
  height: number
}

export const VIEW_PORT_WIDTH = {
  Desktop: 1200,
  Tablet: 769,
  Phone: 576
} as const

export type AuthStatusType = 'authorized' | 'unauthorized' | 'loading'

export interface IMessageInputData {
  body: string
  images: IImageObject[]
  imageCompression: boolean
}

export interface ISystemStore {
  auth: AuthStatusType
  online: boolean
  reconnecting: boolean
  contextMenu: IContextMenu
  viewPort: IViewPort
  hasInteracted: boolean
  camPermission?: PermissionState
  micPermission?: PermissionState
  repliedMessageData: IRepliedMessage
  messageInputData: IMessageInputData
}
