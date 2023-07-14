import { createSlice } from '@reduxjs/toolkit'
import { CallsState } from './@types/CallsState'
import { Call, CallStatus, CallType, SocketActionsPayload } from 'common-types'

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
    audio: false,
    video: false
  }
}

const initialCallSettings = {
  streamLoading: false,
  audio: true,
  video: false
}

const initialState: CallsState = {
  showCallModal: false,
  isMinified: false,
  settings: initialCallSettings,
  currentCall: initialCurrentCall,
  list: []
}

const callsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    updateAllList(state, { payload }) {
      state.list = payload
    },
    initModalToCall(state, { payload }) {
      state.showCallModal = true
      const { id, avatarPath, username } = payload
      state.currentCall.interlocutorId = id
      state.currentCall.interlocutorAvatarPath = avatarPath
      state.currentCall.interlocutorName = username
      state.currentCall.status = CallStatus.calling
      state.currentCall.type = CallType.outgoing
    },
    updateInterlocutorSettings(state, { payload }) {
      if (!state.currentCall.interlocutorSettings) return
      const { audio, video } = payload
      state.currentCall.interlocutorSettings.audio = audio
      state.currentCall.interlocutorSettings.video = video
    },
    toggleSelfStreamIsLoading(state, { payload }) {
      state.settings.streamLoading = payload
    },
    setCurrentCallAccepted(state) {
      state.currentCall.status = CallStatus.inProgress
    },
    setShowCallModal(state, { payload }) {
      state.showCallModal = true
      state.currentCall.interlocutorName = payload.callerName
      state.currentCall.interlocutorAvatarPath = payload.avatarPath
      state.currentCall.type = CallType.incoming
      if (!state.currentCall.interlocutorSettings) return
      state.currentCall.interlocutorSettings.audio = payload.settings.audio
      state.currentCall.interlocutorSettings.audio = payload.settings.video
    },
    setCallStartedAt(state, { payload }) {
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
    toggleCallVideo(state) {
      state.settings.video = !state.settings.video
    },
    toggleCallAudio(state) {
      state.settings.audio = !state.settings.audio
    },
    setCallId(state, { payload }) {
      state.currentCall.id = payload
    },
    updateCalls(state, { payload }: { payload: SocketActionsPayload['callsUpdated'] }) {
      state.list = payload
    },
    updateCall(state, { payload }: { payload: SocketActionsPayload['callUpdated'] }) {
      const call = payload
      const index = state.list.findIndex((stateCall) => stateCall.id === call.id)
      if (index) state.list[index] = call
      if (!state.currentCall.id) state.currentCall.id = call.id
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
  toggleCallVideo,
  toggleCallAudio,
  updateInterlocutorSettings,
  setCallStartedAt,
  toggleSelfStreamIsLoading,
  setShowCallModal,
  updateCalls,
  updateCall,
  setCallId
} = callsSlice.actions

export default callsSlice.reducer
