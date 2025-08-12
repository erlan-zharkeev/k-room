import { createSlice } from '@reduxjs/toolkit'
import { IFrontendUserData, IInfoNotification } from 'common-types'

import type { IUserStore } from '../types'

const initialState: IUserStore = {
  isAuth: false,
  userData: {
    id: '',
    role: 'user',
    email: '',
    username: '',
    online: false,
    chatRooms: [],
    contacts: [],
    avatar: '',
    provider: '',
    infoNotifications: []
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserStore(state) {
      state.isAuth = false
      state.userData = {
        id: '',
        role: 'user',
        email: '',
        username: '',
        online: false,
        chatRooms: [],
        contacts: [],
        avatar: '',
        provider: '',
        infoNotifications: []
      }
    },
    updateInfoNotificationContent(state, { payload }: { payload: IInfoNotification[] }) {
      payload.forEach((newItem) => {
        const index = state.userData.infoNotifications.findIndex((item) => item.id === newItem.id)
        if (index !== -1) {
          state.userData.infoNotifications[index].content = newItem.content
        }
      })
    },
    setInfoItems(state, { payload }: { payload: IInfoNotification[] }) {
      state.userData.infoNotifications = payload
    },
    markInfoNotificationAsRead(state, { payload }: { payload: { id: string } }) {
      const { id } = payload
      if (!state.userData.infoNotifications) return
      const index = state.userData.infoNotifications.findIndex((item) => item.id === id)
      state.userData.infoNotifications[index].read = true
    },
    setUserData: (state, { payload }: { payload: IFrontendUserData }) => {
      state.userData = {
        ...state.userData,
        ...payload
      }
      state.isAuth = true
    }
  }
})

export const { setUserData, resetUserStore, setInfoItems, markInfoNotificationAsRead, updateInfoNotificationContent } =
  userSlice.actions
