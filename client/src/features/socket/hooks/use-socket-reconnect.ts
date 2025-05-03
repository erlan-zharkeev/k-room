import axios from 'axios'
import { AuthEndpointsEnum, SocketActionsType } from 'common-types'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

import { setReconnectingStatus } from 'src/entities/system'

import { socket, useApiInterсeptor } from 'src/shared/api'

export const useSocketReconnect = () => {
  const dispatch = useDispatch()
  const { interceptError } = useApiInterсeptor()

  const socketReconnect = async () => {
    try {
      await axios.get(`/api${AuthEndpointsEnum.UpdateTokensPair}`, { headers: { 'Content-Type': 'application/json' } })
    } catch (e) {
      interceptError(e)
    }
    socket.auth = { token: Cookies.get('jwt') }
    socket.connect()
    socket.emit<SocketActionsType>('initialize')
    dispatch(setReconnectingStatus(false))
  }
  return { socketReconnect }
}
