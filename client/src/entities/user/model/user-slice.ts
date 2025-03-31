import { ThunkDispatch, AnyAction, createSlice } from '@reduxjs/toolkit'
import { IUserSettings, IInfoItem, RouteNamesEnum, IUserData } from 'common-types'
import { clearCookie } from 'src/shared/utils'
import { router } from 'src/shared/lib'
import { updateSettings } from 'src/entities/settings'

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
    | 'infoItems'
  >
>
export interface UserState {
  isAuth: boolean
  userData: StoreUserData
}

export const commonSetUserDataHandler = (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  data: { userData: IUserData; settings: IUserSettings }
) => {
  dispatch(userSlice.actions.setUserData(data.userData))
  dispatch(updateSettings(data.settings))
}

const initialState: UserState = {
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
        role: 'user',
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
    setInfoItems(state, { payload }: { payload: IInfoItem[] }) {
      state.userData.infoItems = payload
    },
    markInfoItemAsRead(state, { payload }: { payload: { id: string } }) {
      const { id } = payload
      if (!state.userData.infoItems) return
      const index = state.userData.infoItems.findIndex((item) => item.id === id)
      state.userData.infoItems[index].read = 'read'
    },
    setUserData: (state, { payload }: { payload: IUserData }) => {
      state.userData = {
        ...state.userData,
        ...payload
      }
      state.isAuth = true
    },
    logOut: (state) => {
      clearCookie()
      state.isAuth = false
      router.push(RouteNamesEnum.Login)
    }
  }
})

export const { setUserData, logOut, setInfoItems, markInfoItemAsRead, resetUserStore } = userSlice.actions
