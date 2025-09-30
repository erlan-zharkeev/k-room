import { SocketActionsType } from 'common-types'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

import { setReconnectingStatus } from 'src/entities/system'

import { socket } from 'src/shared/api'

export const useSocketConnect = () => {
  const dispatch = useDispatch()

  const socketConnect = async () => {
    socket.auth = { token: Cookies.get('jwt'), deviceId: Cookies.get('device-id') }
    socket.connect()
    socket.emit<SocketActionsType>('initialize')
    dispatch(setReconnectingStatus(false))
  }

  return { socketConnect }
}
