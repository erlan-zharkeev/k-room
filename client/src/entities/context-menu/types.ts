import { IMessage } from 'common-types'

export type ContextMenuType = '' | 'message'
export interface ContextMenu {
  slotName: ContextMenuType
  coord: {
    x: number
    y: number
  }
  contextClickedObject: ContextClickedObject
}
export interface ContextClickedObject {
  message: IMessage
}
