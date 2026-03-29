import { createSlice } from '@reduxjs/toolkit'
import { IRepliedMessage } from 'common'

import { type IContextMenu, CONTEXT_MENU_HEIGHT, CONTEXT_MENU_WIDTH } from 'src/entities/context-menu'

import {
  INITIAL_VIEWPORT,
  INITIAL_SYSTEM_STORE,
  INITIAL_CONTEXT_MENU,
  CLICKED_OBJECT_INITIAL_STATE,
  INITIAL_REPLIED_MESSAGE_DATA
} from '../config'
import type { AuthStatusType, IMessageInputData, ISystemStore, IViewPort } from '../config'

const initialState: ISystemStore = INITIAL_SYSTEM_STORE

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setAuth: (state, { payload }: { payload: AuthStatusType }) => {
      state.auth = payload
    },
    setOnline: (state, { payload }: { payload: boolean }) => {
      state.online = payload
    },
    resetSystemStore: (state) => {
      state.reconnecting = false
      state.contextMenu = {
        name: '',
        coord: {
          x: 0,
          y: 0
        },
        contextClickedObject: CLICKED_OBJECT_INITIAL_STATE
      }
      state.viewPort = INITIAL_VIEWPORT
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
    },
    updateMessageInputData(state, { payload }: { payload: Partial<IMessageInputData> }) {
      state.messageInputData = {
        ...state.messageInputData,
        ...payload
      }
    },
    removeImageByNameFromMessageInputData(state, { payload }: { payload: string }) {
      state.messageInputData.images = state.messageInputData.images.filter((img: { name: string }) => img.name !== payload)
    },
    updateRepliedMessage(state, { payload }: { payload: IRepliedMessage }) {
      state.repliedMessageData = payload
    },
    resetRepliedMessage(state) {
      state.repliedMessageData = INITIAL_REPLIED_MESSAGE_DATA
    }
  }
})

export const {
  setReconnectingStatus,
  setAuth,
  setOnline,
  setViewPort,
  setContextMenu,
  resetContextClickedObject,
  resetSystemStore,
  setHasInteraction,
  updateCamPermission,
  updateMicPermission,
  resetContextMenuToInitial,
  removeImageByNameFromMessageInputData,
  updateMessageInputData,
  updateRepliedMessage,
  resetRepliedMessage
} = systemSlice.actions
