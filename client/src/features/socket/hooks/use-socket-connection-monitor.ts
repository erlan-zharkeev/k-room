import { useContext, useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { IEventErrorMessage, IEventAuthError, SocketActionsType } from 'common'

import { useSocketReconnect } from 'src/features/socket'

import { useNotification } from 'src/entities/notification'
import { setReconnectingStatus } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { log } from 'src/shared/lib'
import { AdditionalServiceContext } from 'src/shared/providers'

export const useSocketConnectionMonitor = () => {
  const notifications = useNotification()
  const dispatch = useDispatch()
  const { call } = useContext(AdditionalServiceContext)
  const { socketReconnect } = useSocketReconnect()

  useEffect(() => {
    socket.emit<SocketActionsType>('initialize')

    socket.on<SocketActionsType>('connection', () => {
      log('success', 'Socket connected')
    })

    socket.on<SocketActionsType>('disconnect', () => {
      log('error', 'Socket disconnected')
      if (call.current) {
        call.current.closeConnection(true)
      }
    })

    socket.on<SocketActionsType>('error-message', ({ message }: IEventErrorMessage) => {
      const errorMessageNotification = notifications.getNotification({ messageType: 'error', message })
      errorMessageNotification.open()
    })

    socket.on<SocketActionsType>('auth-error', async ({ event, payload }: IEventAuthError) => {
      await socketReconnect()
      socket.emit(event, payload) // Replay Failed Event
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
