import { IContextMenu } from 'src/entities/context-menu'

import { ISystemStore } from './types'

export const CLICKED_OBJECT_INITIAL_STATE = {
  message: {
    id: '',
    authorName: '',
    author: '',
    body: '',
    authorId: ''
  }
}

export const INITIAL_MODAL_DATA = {
  title: '',
  modalContentComponentName: null,
  width: '320px'
}

export const INITIAL_VIEWPORT = {
  width: 1920,
  height: 1080
}

export const INITIAL_CONTEXT_MENU: IContextMenu = {
  name: '',
  coord: {
    x: 0,
    y: 0
  },
  contextClickedObject: CLICKED_OBJECT_INITIAL_STATE
}

export const INITIAL_SYSTEM_STORE: ISystemStore = {
  isAppLoading: false,
  reconnecting: false,
  showModal: false,
  contextMenu: INITIAL_CONTEXT_MENU,
  modalData: INITIAL_MODAL_DATA,
  viewPort: INITIAL_VIEWPORT,
  hasInteracted: false,
  camPermission: undefined,
  micPermission: undefined
}
