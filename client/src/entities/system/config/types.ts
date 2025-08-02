import { UnknownCallback } from 'common-types'

import type { ModalContentComponentName } from 'src/widgets/modal/ui/Modal/types'

import { IContextMenu } from '../../context-menu'

export interface IViewPort {
  width: number
  height: number
}

export enum ViewPortWidthType {
  Desktop = 1200,
  Tablet = 769,
  Phone = 576
}

export interface IModalBtn {
  text: string
  loader?: boolean
  callback?: UnknownCallback
}

export interface IModalData {
  width?: string
  title?: string
  modalContentComponentName?: ModalContentComponentName | null
  textContent?: string
  confirmBtn?: IModalBtn
  cancelBtn?: IModalBtn
}

export interface ISystemStore {
  isAppLoading: boolean
  reconnecting: boolean
  showModal: boolean
  contextMenu: IContextMenu
  modalData: IModalData
  viewPort: IViewPort
  hasInteracted: boolean
  camPermission?: PermissionState
  micPermission?: PermissionState
}
