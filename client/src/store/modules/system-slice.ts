import { createSlice } from '@reduxjs/toolkit'
import { clientConstants } from 'src/client-constants'
import {
  ViewPort,
  ContextMenuType,
  ContextMenu,
  ContextClickedObject,
  ModalContentComponentName,
  ViewPortWidthType
} from 'src/@types'

interface ModalBtn {
  text: string
  loader?: boolean
  callback?: (...args: unknown[]) => void
}

interface ModalData {
  width?: string
  title?: string
  modalContentComponentName?: ModalContentComponentName | null
  textContent?: string
  confirmBtn?: ModalBtn
  cancelBtn?: ModalBtn
}

interface SystemStore {
  isAppLoading: boolean
  reconnecting: boolean
  showModal: boolean
  allowAudioContext: boolean
  contextMenu: ContextMenu
  modalData: ModalData
  viewPort: ViewPort
}

const clickedObjectInitialState = {
  message: {
    id: '',
    authorName: '',
    author: '',
    body: '',
    authorId: ''
  }
}

const initialModalData = {
  title: '',
  modalContentComponentName: null,
  width: '320px'
}

const initViewPort = {
  width: 1920,
  height: 1080
}

const initialState: SystemStore = {
  isAppLoading: false,
  reconnecting: false,
  showModal: false,
  allowAudioContext: false,
  contextMenu: {
    slotName: '',
    coord: {
      x: 0,
      y: 0
    },
    contextClickedObject: clickedObjectInitialState
  },
  modalData: initialModalData,
  viewPort: initViewPort
}

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    resetSystemStore: (state) => {
      state.isAppLoading = false
      state.reconnecting = false
      state.showModal = false
      state.contextMenu = {
        slotName: '',
        coord: {
          x: 0,
          y: 0
        },
        contextClickedObject: clickedObjectInitialState
      }
      state.modalData = initialModalData
      state.viewPort = initViewPort
    },
    enableAllowAudioContext: (state) => {
      state.allowAudioContext = true
    },
    changeIsAppLoading: (state, { payload }: { payload: boolean }) => {
      state.isAppLoading = payload
    },
    setReconnectingStatus(state, { payload }: { payload: boolean }) {
      state.reconnecting = payload
    },
    showModal(state, { payload }: { payload: ModalData }) {
      state.modalData = payload
      state.showModal = true
    },
    closeModal(state) {
      state.showModal = false
      state.modalData = initialModalData
    },
    setViewPort(state, { payload }: { payload: ViewPort }) {
      state.viewPort = payload
      const viewPortWidth = state.viewPort.width
      const viewPortType = viewPortWidth <= ViewPortWidthType.Phone ? 'mobile' : 'desktop'
      const html = document.querySelector('html')
      html?.setAttribute('view-port', viewPortType)
    },
    setContextMenu(
      state,
      {
        payload
      }: {
        payload: {
          event: React.MouseEvent<HTMLDivElement, MouseEvent> | null
          type: ContextMenuType
          contextClickedObject?: ContextClickedObject
        }
      }
    ) {
      const { event, type, contextClickedObject } = payload
      if (clientConstants.blockNativeContextMenu && event) event.preventDefault()
      state.contextMenu.slotName = type
      if (!event) return
      const currentClickedObject = state.contextMenu.contextClickedObject
      state.contextMenu.contextClickedObject = { ...currentClickedObject, ...contextClickedObject }
      const viewportWidth = state.viewPort.width
      const viewportHeight = state.viewPort.height
      let x = event.pageX
      let y = event.pageY
      const defaultPadding = 4
      const menuWidth = clientConstants.dimensions.contextMenuWidth
      const menuHeight = clientConstants.dimensions.contextMenuHeight
      if (menuWidth + x > viewportWidth) x = viewportWidth - menuWidth - defaultPadding
      if (menuHeight + y > viewportHeight) y = viewportHeight - menuHeight - defaultPadding
      state.contextMenu.coord = {
        x,
        y
      }
    },
    resetContextClickedObject(state) {
      state.contextMenu.contextClickedObject = clickedObjectInitialState
    }
  }
})
