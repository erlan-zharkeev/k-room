import { createSlice } from '@reduxjs/toolkit'
import { SocketActions } from 'common-types'
import { useState, useEffect } from 'react'
import { $sound, Sounds } from 'src/services/$sound'
import { socket } from 'src/socket/socket'
import { CallsState } from './@types/CallsState'

const initialState: CallsState = {
  showCallModal: false,
  isMinified: false,
  videoEnabled: false,
  userVideoPositionRelative: false,
  currentCall: {
    authorId: '',
    authorName: '',
    startedAt: 1674784901,
    interlocutorName: 'Ivan',
    interlocutorId: '0',
    interlocutorAvatar: '',
    type: 'incoming',
    video: false,
    status: 'calling'
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
    setCurrentCallAccepted(state) {
      state.currentCall.status = 'in-progress'
    },
    setShowCallModal(state, { payload }) {
      state.showCallModal = true
      state.currentCall.interlocutorName = payload.callerName
      state.currentCall.interlocutorAvatar = payload.avatar
      state.currentCall.type = 'incoming'
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
        status: 'calling'
      }
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

export const {
  updateAllList,
  setCurrentCallAccepted,
  initModalToCall,
  closeCallModal,
  setMinify,
  unsetMinify,
  toggleEnableVideo,
  setShowCallModal
} = callsSlice.actions

export default callsSlice.reducer
