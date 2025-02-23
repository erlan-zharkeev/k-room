import { createSlice } from '@reduxjs/toolkit'
import {
  Call,
  EventCallStartedAt,
  EventCallsUpdated,
  EventCallUpdated,
  EventCallUser,
  UserMediaType,
  UserShort
} from 'common-types'

interface Constraint {
  loading: boolean
  value: boolean
}

interface StreamConstraints {
  audio: Constraint
  video: Constraint
}

interface CallsState {
  showCallModal: boolean
  isMinified: boolean
  currentCall: Call
  list: Array<Call>
  settings: StreamConstraints
}

const initialCurrentCall: Call = {
  id: '',
  authorId: '',
  authorName: '',
  startedAt: 0,
  interlocutorName: '',
  interlocutorId: '',
  interlocutorAvatarPath: '',
  type: 'incoming',
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

const initialState: CallsState = {
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
    updateAllList(state, { payload }: { payload: Array<Call> }) {
      state.list = payload
    },
    initModalToCall(state, { payload }: { payload: UserShort }) {
      state.showCallModal = true
      const { id, avatarPath, username } = payload
      state.currentCall.interlocutorId = id
      state.currentCall.interlocutorAvatarPath = avatarPath
      state.currentCall.interlocutorName = username
      state.currentCall.status = 'calling'
      state.currentCall.type = 'outgoing'
    },
    updateInterlocutorSettings(state, { payload }: { payload: { audio?: boolean; video?: boolean } }) {
      if (!state.currentCall.interlocutorSettings) return
      const currentSettings = { ...state.currentCall.interlocutorSettings }
      state.currentCall.interlocutorSettings = {
        ...currentSettings,
        ...payload
      }
    },
    toggleSelfStreamIsLoading(state, { payload }: { payload: StreamConstraints }) {
      state.settings = payload
    },
    setCurrentCallAccepted(state) {
      state.currentCall.status = 'in-progress'
    },
    setShowCallModal(state, { payload }: { payload: EventCallUser }) {
      state.showCallModal = true
      state.currentCall.interlocutorName = payload.callerName
      state.currentCall.interlocutorAvatarPath = payload.avatarPath
      state.currentCall.type = 'incoming'
    },
    setCallStartedAt(state, { payload }: { payload: EventCallStartedAt }) {
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
    setCallSettingsLoading(state, { payload }: { payload: { type: UserMediaType; value: boolean } }) {
      const { type, value } = payload
      state.settings[type].loading = value
    },
    setCallId(state, { payload }: { payload: string }) {
      state.currentCall.id = payload
    },
    updateCalls(state, { payload }: { payload: EventCallsUpdated }) {
      state.list = payload
    },
    updateCall(state, { payload }: { payload: EventCallUpdated }) {
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
