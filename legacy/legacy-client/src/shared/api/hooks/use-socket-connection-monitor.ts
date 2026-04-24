import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { IEventAuthError, IEventErrorMessage, SocketActionsType } from 'common'

import { log } from 'src/shared/lib'
import { useNotification } from 'src/shared/notification'
import { setReconnectingStatus } from 'src/shared/system'

import { socket } from '../internals/socket'
import { useSocketReconnect } from './use-socket-reconnect'

export const useSocketConnectionMonitor = () => {
  const notifications = useNotification()
  const dispatch = useDispatch()
  const { socketReconnect } = useSocketReconnect()

  useEffect(() => {
    socket.emit<SocketActionsType>('initialize')

    socket.on<SocketActionsType>('connection', () => {
      log('success', 'Socket connected')
    })

    socket.on<SocketActionsType>('disconnect', () => {
      log('error', 'Socket disconnected')
    })

    socket.on<SocketActionsType>('error-message', ({ message }: IEventErrorMessage) => {
      const errorMessageNotification = notifications.getNotification({ messageType: 'error', message })
      errorMessageNotification.open()
    })

    socket.on<SocketActionsType>('auth-error', async ({ event, payload }: IEventAuthError) => {
      await socketReconnect()
      socket.emit(event, payload)
    })

    socket.on<SocketActionsType>('reconnect', (attempt: number) => {
      log('success', `Socket reconnected on attempt: ${attempt}`)
      socket.emit<SocketActionsType>('initialize')
      socket.emit<SocketActionsType>('actualize-user-data')
      dispatch(setReconnectingStatus(false))
    })

    socket.on<SocketActionsType>('reconnect_attempt', (attempt: number) => {
      log('warn', `Socket reconnecting. Attempt: ${attempt}`)
      dispatch(setReconnectingStatus(true))
    })

    socket.on<SocketActionsType>('reconnect_failed', () => {
      dispatch(setReconnectingStatus(false))
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [])
}
