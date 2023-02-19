import { createSlice } from '@reduxjs/toolkit'
import Call from 'src/call/call'
import { CallsState } from './@types/CallsState'

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
    interlocutorAvatar: '',
    type: 'incoming',
    video: false,
    status: 'calling',
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
      status: 'finished',
      type: 'incoming',
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
      status: 'in-progress',
      type: 'outgoing',
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
      status: 'finished',
      type: 'outgoing',
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
      const { id, avatar, username, stream } = payload
      state.currentCall.interlocutorId = id
      state.currentCall.interlocutorAvatar = avatar
      state.currentCall.interlocutorName = username
      state.currentCall.status = 'calling'
      state.currentCall.type = 'outgoing'
    },
    updateInterlocutorSettings(state, { payload }) {
      const { audio, video } = payload
      state.currentCall.interlocutorSettings.audio = audio
      state.currentCall.interlocutorSettings.video = video
    },
    toggleSelfStreamIsLoading(state, { payload }) {
      state.settings.streamLoading = payload
    },
    setCurrentCallAccepted(state) {
      state.currentCall.status = 'in-progress'
    },
    setShowCallModal(state, { payload }) {
      state.showCallModal = true
      state.currentCall.interlocutorName = payload.callerName
      state.currentCall.interlocutorAvatar = payload.avatar
      state.currentCall.type = 'incoming'
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
        interlocutorAvatar: '',
        type: 'incoming',
        video: false,
        status: 'calling',
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
