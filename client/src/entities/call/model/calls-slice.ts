import { createSlice } from '@reduxjs/toolkit'
import { ICall, EventCallStartedAtType, EventCallsUpdatedType, EventCallUpdatedType, IEventCallUser } from 'common'
import type { IBaseFrontendUserData } from 'common'

import type { CallMediaType, ICallsState, IStreamConstraints } from 'src/entities/call/types'

type CallInterlocutorType = IBaseFrontendUserData & { avatar?: string }

const initialCurrentCall: ICall = {
  id: '',
  authorId: '',
  authorName: '',
  startedAt: 0,
  interlocutorName: '',
  interlocutorId: '',
  interlocutorAvatarPath: '',
  flow: 'incoming',
  video: false,
  status: 'calling',
  interlocutorSettings: {
    streamLoading: false,
    audio: true,
    video: false
  }
}

const initialCallSettings = {
  streamLoading: false,
  audio: {
    loading: false,
    value: true
  },
  video: {
    loading: false,
    value: false
  }
}

const initialState: ICallsState = {
  showCallModal: false,
  isMinified: false,
  settings: initialCallSettings,
  currentCall: initialCurrentCall,
  list: []
}

export const callsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetCallStore(state) {
      state.showCallModal = false
      state.isMinified = false
      state.settings = initialCallSettings
      state.currentCall = initialCurrentCall
      state.list = []
    },
    updateAllList(state, { payload }: { payload: ICall[] }) {
      state.list = payload
    },
    initModalToCall(state, { payload }: { payload: CallInterlocutorType }) {
      state.showCallModal = true
      const { id, avatar, username } = payload
      state.currentCall.interlocutorId = id
      state.currentCall.interlocutorAvatarPath = avatar
      state.currentCall.interlocutorName = username
      state.currentCall.status = 'calling'
      state.currentCall.flow = 'outgoing'
    },
    updateInterlocutorSettings(state, { payload }: { payload: { audio?: boolean; video?: boolean } }) {
      if (!state.currentCall.interlocutorSettings) return
      const currentSettings = { ...state.currentCall.interlocutorSettings }
      state.currentCall.interlocutorSettings = {
        ...currentSettings,
        ...payload
      }
    },
    toggleSelfStreamIsLoading(state, { payload }: { payload: IStreamConstraints }) {
      state.settings = payload
    },
    setCurrentCallAccepted(state) {
      state.currentCall.status = 'in-progress'
    },
    setShowCallModal(state, { payload }: { payload: IEventCallUser }) {
      state.showCallModal = true
      state.currentCall.interlocutorName = payload.callerName
      state.currentCall.interlocutorAvatarPath = payload.avatar
      state.currentCall.flow = 'incoming'
    },
    setCallStartedAt(state, { payload }: { payload: EventCallStartedAtType }) {
      state.currentCall.startedAt = payload
    },
    closeCallModal(state) {
      state.showCallModal = false
      state.currentCall = initialCurrentCall
      state.settings = initialCallSettings
      state.isMinified = false
    },
    setMinify(state) {
      state.isMinified = true
    },
    unsetMinify(state) {
      state.isMinified = false
    },
    setCallVideo(state, { payload }) {
      state.settings.video.value = payload
    },
    setCallAudio(state, { payload }) {
      state.settings.audio.value = payload
    },
    setCallSettingsLoading(state, { payload }: { payload: { type: CallMediaType; value: boolean } }) {
      const { type, value } = payload
      state.settings[type].loading = value
    },
    setCallId(state, { payload }: { payload: string }) {
      state.currentCall.id = payload
    },
    updateCalls(state, { payload }: { payload: EventCallsUpdatedType }) {
      state.list = payload
    },
    updateCall(state, { payload }: { payload: EventCallUpdatedType }) {
      const call = payload
      const listClone = [...state.list]
      const index = listClone.findIndex((stateCall) => stateCall.id === call.id)
      index >= 0 ? (listClone[index] = call) : listClone.push(call)
      if (call.setId) state.currentCall.id = call.id
      state.list = listClone
    },
    markCurrentCallAsVideo(state) {
      state.currentCall.video = true
    }
  }
})

export const {
  updateAllList,
  setCurrentCallAccepted,
  initModalToCall,
  closeCallModal,
  setMinify,
  unsetMinify,
  setCallVideo,
  setCallAudio,
  updateInterlocutorSettings,
  setCallStartedAt,
  toggleSelfStreamIsLoading,
  setShowCallModal,
  updateCalls,
  updateCall,
  setCallId,
  markCurrentCallAsVideo,
  setCallSettingsLoading,
  resetCallStore
} = callsSlice.actions
