import { DEFAULT_APP_LANGUAGE, SocketActionsType } from 'common-types'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

import { settingsStore } from 'src/entities/settings/hooks/use-settings'
import { setReconnectingStatus } from 'src/entities/system'

import { socket } from 'src/shared/api'

export const useSocketConnect = () => {
  const dispatch = useDispatch()

  const socketConnect = async () => {
    const settings = await settingsStore.get()

    socket.auth = {
      token: Cookies.get('jwt'),
      deviceId: Cookies.get('device-id'),
      language: settings?.language ?? DEFAULT_APP_LANGUAGE
    }
    socket.connect()
    socket.emit<SocketActionsType>('initialize')
    dispatch(setReconnectingStatus(false))
  }

  return { socketConnect }
}
