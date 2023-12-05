import { AxiosResponse } from 'axios'
import { Message } from 'common-types'

export interface ContextClickedObject {
  message: Message
}

export type ContextMenuType = '' | 'message'

export type ColorModifiers = 'accent' | 'success' | 'error' | 'warn' | 'default' | 'white' | 'black'

export type SizeModifiers = 'xl' | 'large' | 'medium' | 'small'

export type ShapeModifiers = 'round' | 'square'

export interface AsyncThunkResponseWrapper {
  payload: AxiosResponse
}

export enum ViewPortWidthType {
  desktop = 1200,
  tablet = 769,
  phone = 576
}

export interface ViewPort {
  width: number
  height: number
}

export interface ContextMenu {
  slotName: ContextMenuType
  coord: {
    x: number
    y: number
  }
  contextClickedObject: ContextClickedObject
}

export enum ModalContentComponentName {
  userDataSettingsPopup = 'UserDataSettingsPopup',
  techSettingsPopup = 'TechSettingsPopup',
  forwardMessagePopup = 'ForwardMessagePopup',
  createMultipleChatPopup = 'CreateMultipleChatPopup',
  chatRoomSettingsPopup = 'ChatRoomSettingsPopup',
  messageWithBindDataPopup = 'MessageWithBindDataPopup'
}

export enum UIAvatarBadgePlacement {
  up = 'up',
  down = 'down'
}
