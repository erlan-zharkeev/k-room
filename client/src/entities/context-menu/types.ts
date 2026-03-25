import { IMessage } from 'common'

export type ContextMenuNameType = '' | 'message'

export interface ICoord {
  x: number
  y: number
}

export interface IContextMenu {
  name: ContextMenuNameType
  coord: ICoord
  contextClickedObject: IContextClickedObject
}
export interface IContextClickedObject {
  message: IMessage
}
