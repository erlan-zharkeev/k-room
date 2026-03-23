import { IImageObject, IRepliedMessage } from 'common-types'

import { IContextMenu } from 'src/entities/context-menu'

export interface IViewPort {
  width: number
  height: number
}

export enum ViewPortWidthType {
  Desktop = 1200,
  Tablet = 769,
  Phone = 576
}

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
