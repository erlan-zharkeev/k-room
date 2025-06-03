import { IMessage } from 'common-types'

export type ContextMenuNameType = '' | 'message'

export interface ICoord {
  x: number
  y: number
}

export interface ContextMenu {
  name: ContextMenuNameType
  coord: ICoord
  contextClickedObject: ContextClickedObject
}
export interface ContextClickedObject {
  message: IMessage
}
