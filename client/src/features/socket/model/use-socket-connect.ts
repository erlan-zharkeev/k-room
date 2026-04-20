import { useDispatch } from 'react-redux'

import { SocketActionsType } from 'common'

import { socket } from 'src/shared/api'
import { useSettings } from 'src/shared/preferences'
import { setReconnectingStatus } from 'src/shared/system'

export const useSocketConnect = () => {
  const dispatch = useDispatch()
  const { language } = useSettings()

  const socketConnect = async () => {
    socket.auth = {
      language
    }
    socket.connect()
    socket.emit<SocketActionsType>('initialize')
    socket.emit<SocketActionsType>('actualize-user-data')
    dispatch(setReconnectingStatus(false))
  }

  return { socketConnect }
}
