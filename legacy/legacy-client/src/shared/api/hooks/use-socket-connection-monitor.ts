import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { EventAuthError, EventErrorMessage, SocketActions } from 'common'

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
    socket.emit<SocketActions>('initialize')

    socket.on<SocketActions>('connection', () => {
      log('success', 'Socket connected')
    })

    socket.on<SocketActions>('disconnect', () => {
      log('error', 'Socket disconnected')
    })

    socket.on<SocketActions>('error-message', ({ message }: EventErrorMessage) => {
      const errorMessageNotification = notifications.getNotification({ messageType: 'error', message })
      errorMessageNotification.open()
    })

    socket.on<SocketActions>('auth-error', async ({ event, payload }: EventAuthError) => {
      await socketReconnect()
      socket.emit(event, payload)
    })

    socket.on<SocketActions>('reconnect', (attempt: number) => {
      log('success', `Socket reconnected on attempt: ${attempt}`)
      socket.emit<SocketActions>('initialize')
      socket.emit<SocketActions>('actualize-user-data')
      dispatch(setReconnectingStatus(false))
    })

    socket.on<SocketActions>('reconnect_attempt', (attempt: number) => {
      log('warn', `Socket reconnecting. Attempt: ${attempt}`)
      dispatch(setReconnectingStatus(true))
    })

    socket.on<SocketActions>('reconnect_failed', () => {
      dispatch(setReconnectingStatus(false))
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [])
}
