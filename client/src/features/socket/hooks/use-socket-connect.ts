import { SocketActionsType } from 'common'
import { useDispatch } from 'react-redux'

import { useSettings } from 'src/entities/settings'
import { setReconnectingStatus } from 'src/entities/system'

import { socket } from 'src/shared/api'

export const useSocketConnect = () => {
  const dispatch = useDispatch()
  const { language } = useSettings()

  const socketConnect = async () => {
    socket.auth = {
      language
    }
    socket.connect()
    socket.emit<SocketActionsType>('initialize')
    dispatch(setReconnectingStatus(false))
  }

  return { socketConnect }
}
