import { createSlice } from '@reduxjs/toolkit'

import { type IContextMenu, CONTEXT_MENU_HEIGHT, CONTEXT_MENU_WIDTH } from 'src/entities/context-menu'

import {
  INITIAL_MODAL_DATA,
  INITIAL_VIEWPORT,
  INITIAL_SYSTEM_STORE,
  INITIAL_CONTEXT_MENU,
  CLICKED_OBJECT_INITIAL_STATE
} from '../config'
import type { IModalData, IViewPort } from '../config/types'

export const systemSlice = createSlice({
  name: 'system',
  initialState: INITIAL_SYSTEM_STORE,
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
        contextClickedObject: CLICKED_OBJECT_INITIAL_STATE
      }
      state.modalData = INITIAL_MODAL_DATA
      state.viewPort = INITIAL_VIEWPORT
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
    showModal(state, { payload }: { payload: IModalData }) {
      state.modalData = payload
      state.showModal = true
    },
    closeModal(state) {
      state.showModal = false
      state.modalData = INITIAL_MODAL_DATA
    },
    setHasInteraction(state, { payload }: { payload: boolean }) {
      state.hasInteracted = payload
    },
    setViewPort(state, { payload }: { payload: IViewPort }) {
      state.viewPort = payload
    },
    setContextMenu(state, { payload }: { payload: IContextMenu }) {
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
      state.contextMenu.contextClickedObject = CLICKED_OBJECT_INITIAL_STATE
    },
    resetContextMenuToInitial(state) {
      state.contextMenu = INITIAL_CONTEXT_MENU
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
