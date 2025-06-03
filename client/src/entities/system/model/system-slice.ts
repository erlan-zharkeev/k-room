import { createSlice } from '@reduxjs/toolkit'
import { UnknownCallback } from 'common-types'

import { ModalContentComponentName } from 'src/widgets/modal/ui/Modal/types'

import {
  ContextMenu,
  ContextMenuNameType,
  ContextClickedObject,
  CONTEXT_MENU_HEIGHT,
  CONTEXT_MENU_WIDTH,
  ICoord
} from 'src/entities/context-menu'

interface ModalBtn {
  text: string
  loader?: boolean
  callback?: UnknownCallback
}

interface ModalData {
  width?: string
  title?: string
  modalContentComponentName?: ModalContentComponentName | null
  textContent?: string
  confirmBtn?: ModalBtn
  cancelBtn?: ModalBtn
}

interface ViewPort {
  width: number
  height: number
}

interface SystemStore {
  isAppLoading: boolean
  reconnecting: boolean
  showModal: boolean
  contextMenu: ContextMenu
  modalData: ModalData
  viewPort: ViewPort
  hasInteracted: boolean
  camPermission?: PermissionState
  micPermission?: PermissionState
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

const initialContextMenu: ContextMenu = {
  name: '',
  coord: {
    x: 0,
    y: 0
  },
  contextClickedObject: clickedObjectInitialState
}

const initialState: SystemStore = {
  isAppLoading: false,
  reconnecting: false,
  showModal: false,
  contextMenu: initialContextMenu,
  modalData: initialModalData,
  viewPort: initViewPort,
  hasInteracted: false,
  camPermission: undefined,
  micPermission: undefined
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
        name: '',
        coord: {
          x: 0,
          y: 0
        },
        contextClickedObject: clickedObjectInitialState
      }
      state.modalData = initialModalData
      state.viewPort = initViewPort
    },
    updateAppLoaderState: (state, { payload }: { payload: boolean }) => {
      state.isAppLoading = payload
    },
    updateCamPermission: (state, { payload }: { payload: PermissionState }) => {
      state.camPermission = payload
    },
    updateMicPermission: (state, { payload }: { payload: PermissionState }) => {
      state.micPermission = payload
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
    setHasInteraction(state, { payload }: { payload: boolean }) {
      state.hasInteracted = payload
    },
    setViewPort(state, { payload }: { payload: ViewPort }) {
      state.viewPort = payload
    },
    setContextMenu(state, { payload }: { payload: ContextMenu }) {
      const { coord, name, contextClickedObject } = payload
      state.contextMenu.name = name
      const currentClickedObject = state.contextMenu.contextClickedObject
      state.contextMenu.contextClickedObject = { ...currentClickedObject, ...contextClickedObject }
      const viewportWidth = state.viewPort.width
      const viewportHeight = state.viewPort.height
      let xAxis = coord.x
      let yAxis = coord.y
      const defaultPadding = 4
      const menuWidth = CONTEXT_MENU_WIDTH
      const menuHeight = CONTEXT_MENU_HEIGHT
      if (menuWidth + xAxis > viewportWidth) xAxis = viewportWidth - menuWidth - defaultPadding
      if (menuHeight + yAxis > viewportHeight) yAxis = viewportHeight - menuHeight - defaultPadding
      state.contextMenu.coord = {
        x: xAxis,
        y: yAxis
      }
    },
    resetContextClickedObject(state) {
      state.contextMenu.contextClickedObject = clickedObjectInitialState
    },
    resetContextMenuToInitial(state) {
      state.contextMenu = initialContextMenu
    }
  }
})

export const {
  setReconnectingStatus,
  showModal,
  closeModal,
  setViewPort,
  setContextMenu,
  resetContextClickedObject,
  updateAppLoaderState,
  resetSystemStore,
  setHasInteraction,
  updateCamPermission,
  updateMicPermission,
  resetContextMenuToInitial
} = systemSlice.actions
