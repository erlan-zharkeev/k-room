import { IUserData, IUserSettings } from 'common-types'
import { useDispatch } from 'react-redux'

import { useThemeUpdate } from 'src/features/settings'

import { updateSettings } from 'src/entities/settings'
import { setUserData as storeSetUserData } from 'src/entities/user'

import { socket } from 'src/shared/api'

export const useSetUserData = () => {
  const dispatch = useDispatch()
  const { setTheme } = useThemeUpdate()

  const setUserData = ({ userData, settings }: { userData: IUserData; settings: IUserSettings }) => {
    dispatch(storeSetUserData(userData))
    dispatch(updateSettings(settings))
    setTheme(settings.theme)
    socket.connect()
  }

  return { setUserData }
}
