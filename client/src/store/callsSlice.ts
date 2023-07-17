import { createSlice } from '@reduxjs/toolkit'
import { CallsState } from './@types/CallsState'
import { Call, CallStatus, CallType, SocketActionsPayload, StreamSettings, UserShort } from 'common-types'

const initialCurrentCall = {
  id: '',
  authorId: '',
  authorName: '',
  startedAt: 0,
  interlocutorName: 'ucon',
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
    updateInterlocutorSettings(state, { payload }: { payload: SocketActionsPayload['changeCallSettings'] }) {
      if (!state.currentCall.interlocutorSettings) return
      const { audio, video } = payload
      state.currentCall.interlocutorSettings.audio = audio
      state.currentCall.interlocutorSettings.video = video
    },
    toggleSelfStreamIsLoading(state, { payload }: { payload: boolean }) {
      state.settings.streamLoading = payload
    },
    setCurrentCallAccepted(state) {
      state.currentCall.status = CallStatus.inProgress
    },
    setShowCallModal(state, { payload }: { payload: SocketActionsPayload['callUser'] }) {
      state.showCallModal = true
      state.currentCall.interlocutorName = payload.callerName
      state.currentCall.interlocutorAvatarPath = payload.avatarPath
      state.currentCall.type = CallType.incoming
      if (!state.currentCall.interlocutorSettings) return
      state.currentCall.interlocutorSettings.audio = payload.settings.audio
      state.currentCall.interlocutorSettings.audio = payload.settings.video
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
    toggleCallVideo(state) {
      state.settings.video = !state.settings.video
    },
    toggleCallAudio(state) {
      state.settings.audio = !state.settings.audio
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
