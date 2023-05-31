import { AnyAction, createSlice, ThunkDispatch } from '@reduxjs/toolkit'
import { RouteNames, User, UserSettings } from 'common-types'
import $router from 'src/services/$router'
import clearCookie from 'src/utils/clearCookie'
import { UserState } from './@types/UserState'
import { updateSettings } from './settingsSlice'

export const commonSetUserDataHandler = (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  data: { userData: User; settings: UserSettings }
) => {
  dispatch(setUserData(data.userData))
  dispatch(updateSettings(data.settings))
  $router.push(RouteNames.MAIN)
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
    avatar: '',
    providerName: '',
    infoItems: []
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfoItems(state, { payload }) {
      state.userData.infoItems = payload
    },
    markInfoItemAsRead(state, { payload }) {
      const { id } = payload
      if (!state.userData.infoItems) return
      const index = state.userData.infoItems.findIndex((item) => item.id === id)
      state.userData.infoItems[index].read = 'read'
    },
    changeIsAppLoading: (state, { payload }) => {
      state.isAppLoading = payload
    },
    setUserData: (state, { payload }) => {
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
