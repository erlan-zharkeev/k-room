import { createSlice } from '@reduxjs/toolkit'
import { Call, CallStatus, CallType, SocketActionsPayload, UserMediaType, UserShort } from 'common-types'

interface StreamConstraints {
  [UserMediaType.audio]: {
    loading: boolean
    value: boolean
  }
  [UserMediaType.video]: {
    loading: boolean
    value: boolean
  }
}

interface CallsState {
  showCallModal: boolean
  isMinified: boolean
  currentCall: Call
  list: Array<Call>
  settings: StreamConstraints
}

const initialCurrentCall = {
  id: '',
  authorId: '',
  authorName: '',
  startedAt: 0,
  interlocutorName: '',
  interlocutorId: '',
  interlocutorAvatarPath: '',
  type: CallType.incoming,
  video: false,
  status: CallStatus.calling,
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
    updateAllList(state, { payload }: { payload: Array<Call> }) {
      state.list = payload
    },
    initModalToCall(state, { payload }: { payload: UserShort }) {
      state.showCallModal = true
      const { id, avatarPath, username } = payload
      state.currentCall.interlocutorId = id
      state.currentCall.interlocutorAvatarPath = avatarPath
      state.currentCall.interlocutorName = username
      state.currentCall.status = CallStatus.calling
      state.currentCall.type = CallType.outgoing
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
      state.currentCall.status = CallStatus.inProgress
    },
    setShowCallModal(state, { payload }: { payload: SocketActionsPayload['callUser'] }) {
      state.showCallModal = true
      state.currentCall.interlocutorName = payload.callerName
      state.currentCall.interlocutorAvatarPath = payload.avatarPath
      state.currentCall.type = CallType.incoming
    },
    setCallStartedAt(state, { payload }: { payload: SocketActionsPayload['callStartedAt'] }) {
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
    updateCalls(state, { payload }: { payload: SocketActionsPayload['callsUpdated'] }) {
      state.list = payload
    },
    updateCall(state, { payload }: { payload: SocketActionsPayload['callUpdated'] }) {
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
