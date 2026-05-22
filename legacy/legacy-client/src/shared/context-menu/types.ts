import { IMessage } from 'common'

export type ContextMenuName = '' | 'message'

export interface Coord {
  x: number
  y: number
}

export interface ContextMenu {
  name: ContextMenuName
  coord: Coord
  contextClickedObject: ContextClickedObject
}
export interface ContextClickedObject {
  message: IMessage
}
