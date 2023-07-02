import { createSlice } from '@reduxjs/toolkit'
import { CallsState } from './@types/CallsState'
import { CallStatus, CallType } from 'common-types'

const initialState: CallsState = {
  showCallModal: false,
  isMinified: false,
  settings: {
    streamLoading: false,
    audio: true,
    video: true
  },
  currentCall: {
    authorId: '',
    authorName: '',
    startedAt: 1674784901,
    interlocutorName: 'Ivan',
    interlocutorId: '0',
    interlocutorAvatarPath: '',
    type: CallType.incoming,
    video: false,
    status: CallStatus.calling,
    interlocutorSettings: {
      streamLoading: false,
      audio: true,
      video: true
    }
  },
  list: [
    {
      authorId: '',
      authorName: '',
      startedAt: 1674784901,
      finishedAt: 1674784901,
      length: 36,
      interlocutorName: 'Ivan',
      interlocutorId: '0',
      interlocutorAvatarPath: '',
      status: CallStatus.finished,
      type: CallType.incoming,
      video: true
    },
    {
      authorId: '',
      authorName: '',
      startedAt: 1674784901,
      finishedAt: 1674784901,
      length: 156,
      interlocutorName: 'Anton',
      interlocutorId: '1',
      interlocutorAvatarPath: '',
      status: CallStatus.inProgress,
      type: CallType.outgoing,
      video: false
    },
    {
      authorId: '',
      authorName: '',
      startedAt: 1674784901,
      finishedAt: 1674784901,
      length: 342,
      interlocutorName: 'Norbik',
      interlocutorId: '2',
      interlocutorAvatarPath: '',
      status: CallStatus.finished,
      type: CallType.outgoing,
      video: false
    }
  ]
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
      state.currentCall = {
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
  setShowCallModal
} = callsSlice.actions

export default callsSlice.reducer
