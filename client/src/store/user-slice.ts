import { ThunkDispatch, AnyAction, createSlice } from '@reduxjs/toolkit'
import { UserSettings, InfoItem, InfoItemStatus, RouteNames, User } from 'common-types'
import { clearCookie } from 'src/utils'
import { UserState } from './@types'
import { updateSettings } from './settings-slice'
import { $router } from 'src/services'

export const commonSetUserDataHandler = (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  data: { userData: User; settings: UserSettings }
) => {
  dispatch(setUserData(data.userData))
  dispatch(updateSettings(data.settings))
}

const initialState: UserState = {
  isAppLoading: false,
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfoItems(state, { payload }: { payload: Array<InfoItem> }) {
      state.userData.infoItems = payload
    },
    markInfoItemAsRead(state, { payload }: { payload: { id: string } }) {
      const { id } = payload
      if (!state.userData.infoItems) return
      const index = state.userData.infoItems.findIndex((item) => item.id === id)
      state.userData.infoItems[index].read = InfoItemStatus.read
    },
    changeIsAppLoading: (state, { payload }: { payload: boolean }) => {
      state.isAppLoading = payload
    },
    setUserData: (state, { payload }: { payload: User }) => {
      state.userData = {
        ...state.userData,
        ...payload
      }
      state.isAuth = true
      state.isAppLoading = false
    },
    logOut: (state) => {
      clearCookie()
      state.isAuth = false
      $router.push(RouteNames.SIGN_IN)
    }
  }
})

export const { setUserData, logOut, changeIsAppLoading, setInfoItems, markInfoItemAsRead } = userSlice.actions

export default userSlice.reducer
