import { createSlice } from '@reduxjs/toolkit'
import { stat } from 'fs'
import { CallsState } from './@types/CallsState'

const initialState: CallsState = {
  showCallModal: true,
  isMinified: false,
  videoEnabled: false,
  userVideoPositionRelative: false,
  currentCall: {
    startedAt: 1674784901,
    interlocutorName: 'Ivan',
    interlocutorId: '0',
    type: 'incoming',
    video: false
  },
  list: [
    {
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
    initCall(state) {
      state.showCallModal = true
    },
    initVideoCall(state) {
      state.showCallModal = true
    },
    closeCallModal(state) {
      state.showCallModal = false
    },
    setMinify(state) {
      state.isMinified = true
    },
    unsetMinify(state) {
      state.isMinified = false
    },
    toggleEnableVideo(state, { payload }) {
      state.videoEnabled = payload
    }
  }
})

export const { updateAllList, initCall, initVideoCall, closeCallModal, setMinify, unsetMinify, toggleEnableVideo } =
  callsSlice.actions

export default callsSlice.reducer
