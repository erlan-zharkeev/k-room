import { IBaseFrontendUserData, ICall } from 'common'

export interface Constraint {
  loading: boolean
  value: boolean
}

export type CallMedia = 'audio' | 'video'

export interface StreamConstraints {
  audio: Constraint
  video: Constraint
}

export interface CallsState {
  showCallModal: boolean
  isMinified: boolean
  currentCall: ICall
  list: ICall[]
  settings: StreamConstraints
}

export interface ModalOptions {
  width: number
  height: number
  x: number
  y: number
}

export interface CallInterlocutor extends IBaseFrontendUserData {
  avatar?: string
}
