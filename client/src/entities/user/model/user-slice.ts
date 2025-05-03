import { createSlice } from '@reduxjs/toolkit'
import { IUserData, IInfoMessage } from 'common-types'

type StoreUserData = Required<
  Pick<
    IUserData,
    | 'id'
    | 'role'
    | 'email'
    | 'username'
    | 'online'
    | 'chatRooms'
    | 'contacts'
    | 'avatarPath'
    | 'providerName'
    | 'infoNotifications'
  >
>

export interface UserStore {
  isAuth: boolean
  userData: StoreUserData
}

const initialState: UserStore = {
  isAuth: false,
  userData: {
    id: '',
    role: 'user',
    email: '',
    username: '',
    online: false,
    chatRooms: [],
    contacts: [],
    avatarPath: '',
    providerName: '',
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
        avatarPath: '',
        providerName: '',
        infoNotifications: []
      }
    },
    updateInfoNotificationContent(state, { payload }: { payload: IInfoMessage[] }) {
      payload.forEach((newItem) => {
        const index = state.userData.infoNotifications.findIndex((item) => item.id === newItem.id)
        if (index !== -1) {
          state.userData.infoNotifications[index].content = newItem.content
        }
      })
    },
    setInfoItems(state, { payload }: { payload: IInfoMessage[] }) {
      state.userData.infoNotifications = payload
    },
    markInfoNotificationAsRead(state, { payload }: { payload: { id: string } }) {
      const { id } = payload
      if (!state.userData.infoNotifications) return
      const index = state.userData.infoNotifications.findIndex((item) => item.id === id)
      state.userData.infoNotifications[index].read = true
    },
    setUserData: (state, { payload }: { payload: IUserData }) => {
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
