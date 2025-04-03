import { useContext, useEffect } from 'react'

import axios from 'axios'
import { AuthEndpointsEnum, IEventErrorMessage, SocketActionsType } from 'common-types'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { setReconnectingStatus } from 'src/entities/system'
import { useUser } from 'src/entities/user'

import { socket, useApiInterсeptor } from 'src/shared/api'
import { AdditionalServiceContext } from 'src/shared/providers'
import { clg } from 'src/shared/utils'

export const useSocket = () => {
  const notifications = useNotification()
  const { interceptError } = useApiInterсeptor()
  const dispatch = useDispatch()
  const { call } = useContext(AdditionalServiceContext)
  const { isAuth } = useUser()

  const socketDisconnectedNotification = notifications.getNotification({
    messageType: 'error',
    message: ClientNotificationMessage.SocketDisconnected
  })

  const statusNotification = (isSuccess: Boolean) => {
    if (isSuccess) {
      clg('success', 'Socket connected')
      return
    }
    clg('error', 'Socket disconnected')
    if (!isAuth) return
    if (call.current) {
      call.current.closeConnection(true)
    }
    socketDisconnectedNotification.open()
  }

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

  const initSocketConnection = () => {
    useEffect(() => {
      socket.emit<SocketActionsType>('initialize')

      socket.on<SocketActionsType>('connection', () => {
        statusNotification(true)
      })

      socket.on<SocketActionsType>('disconnect', () => {
        statusNotification(false)
      })

      socket.on<SocketActionsType>('error-message', ({ message }: IEventErrorMessage) => {
        const errorMessageNotification = notifications.getNotification({ messageType: 'error', message })
        errorMessageNotification.open()
      })

      socket.on<SocketActionsType>('auth-error', () => {
        socketReconnect()
      })

      socket.on<SocketActionsType>('reconnect', (attempt: number) => {
        clg('success', `Socket reconnected on attempt: ${attempt}`)
        socket.emit<SocketActionsType>('initialize')
        dispatch(setReconnectingStatus(false))
      })

      socket.on<SocketActionsType>('reconnect_attempt', (attempt: number) => {
        clg('warn', `Socket reconnecting. Attempt: ${attempt}`)
        dispatch(setReconnectingStatus(true))
      })

      socket.on<SocketActionsType>('reconnect_failed', () => {
        dispatch(setReconnectingStatus(false))
      })

      if (socket.disconnected) {
        socketReconnect()
      }

      return () => {
        socket.removeAllListeners()
      }
    }, [])
  }

  return {
    initSocketConnection,
    socketReconnect
  }
}
