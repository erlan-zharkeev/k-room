import { useDispatch } from 'react-redux'

import { SocketActions } from 'common'

import { useSettings } from 'src/shared/preferences'
import { setReconnectingStatus } from 'src/shared/system'

import { socket } from '../internals/socket'

export const useSocketConnect = () => {
  const dispatch = useDispatch()
  const { language } = useSettings()

  const socketConnect = async () => {
    socket.auth = {
      language
    }
    socket.connect()
    socket.emit<SocketActions>('initialize')
    socket.emit<SocketActions>('actualize-user-data')
    dispatch(setReconnectingStatus(false))
  }

  return { socketConnect }
}
