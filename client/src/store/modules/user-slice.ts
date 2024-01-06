import { ThunkDispatch, AnyAction, createSlice } from '@reduxjs/toolkit'
import { UserSettings, InfoItem, InfoItemStatus, RouteNames, KRoomUser } from 'common-types'
import { clearCookie } from 'src/utils'
import { $router } from 'src/services'
import { resetStores, updateSettings } from '..'

export interface UserState {
  isAuth: boolean
  userData: KRoomUser
}

export const commonSetUserDataHandler = (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  data: { userData: KRoomUser; settings: UserSettings }
) => {
  dispatch(userSlice.actions.setUserData(data.userData))
  dispatch(updateSettings(data.settings))
}

const initialState: UserState = {
  isAuth: false,
  userData: {
    id: '',
    email: '',
    username: '',
    online: false,
    chatRooms: [],
    contacts: [],
    avatarPath: '',
    providerName: '',
    infoItems: []
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
        email: '',
        username: '',
        online: false,
        chatRooms: [],
        contacts: [],
        avatarPath: '',
        providerName: '',
        infoItems: []
      }
    },
    setInfoItems(state, { payload }: { payload: Array<InfoItem> }) {
      state.userData.infoItems = payload
    },
    markInfoItemAsRead(state, { payload }: { payload: { id: string } }) {
      const { id } = payload
      if (!state.userData.infoItems) return
      const index = state.userData.infoItems.findIndex((item) => item.id === id)
      state.userData.infoItems[index].read = InfoItemStatus.read
    },
    setUserData: (state, { payload }: { payload: KRoomUser }) => {
      state.userData = {
        ...state.userData,
        ...payload
      }
      state.isAuth = true
    },
    logOut: (state) => {
      clearCookie()
      state.isAuth = false
      $router.push(RouteNames.SIGN_IN)
    }
  }
})
