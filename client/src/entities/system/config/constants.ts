import type { IContextMenu } from 'src/entities/context-menu'
import type { ISystemStore } from 'src/entities/system/config/types'

export const CLICKED_OBJECT_INITIAL_STATE = {
  message: {
    id: '',
    authorName: '',
    author: '',
    body: '',
    authorId: ''
  }
}

export const MIN_SUPPORTED_WIDTH = 320

export const MIN_SUPPORTED_HEIGHT = 575

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

export const INITIAL_MESSAGE_INPUT_DATA = {
  imageCompression: true,
  images: [],
  body: ''
}

export const INITIAL_REPLIED_MESSAGE_DATA = {
  id: '',
  authorName: '',
  authorId: '',
  body: '',
  images: [],
  forward: false
}

export const INITIAL_SYSTEM_STORE = {
  auth: 'loading',
  online: true,
  reconnecting: false,
  contextMenu: INITIAL_CONTEXT_MENU,
  viewPort: INITIAL_VIEWPORT,
  hasInteracted: false,
  camPermission: undefined,
  micPermission: undefined,
  repliedMessageData: INITIAL_REPLIED_MESSAGE_DATA,
  messageInputData: INITIAL_MESSAGE_INPUT_DATA
} satisfies ISystemStore
