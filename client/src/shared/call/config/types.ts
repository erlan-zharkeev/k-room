import { IBaseFrontendUserData, ICall } from 'common'

export interface IConstraint {
  loading: boolean
  value: boolean
}

export type CallMediaType = 'audio' | 'video'

export interface IStreamConstraints {
  audio: IConstraint
  video: IConstraint
}

export interface ICallsState {
  showCallModal: boolean
  isMinified: boolean
  currentCall: ICall
  list: ICall[]
  settings: IStreamConstraints
}

export interface IModalOptions {
  width: number
  height: number
  x: number
  y: number
}

export interface ICallInterlocutor extends IBaseFrontendUserData {
  avatar?: string
}
