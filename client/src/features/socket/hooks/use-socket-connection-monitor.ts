import { useContext, useEffect } from 'react'

import { IEventErrorMessage, IEventAuthError, SocketActionsType } from 'common-types'
import { useDispatch } from 'react-redux'

import { useSocketReconnect } from 'src/features/socket'

import { useNotification } from 'src/entities/notification'
import { setReconnectingStatus } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { AdditionalServiceContext } from 'src/shared/providers'
import { clg } from 'src/shared/utils'

export const useSocketConnectionMonitor = () => {
  const notifications = useNotification()
  const dispatch = useDispatch()
  const { call } = useContext(AdditionalServiceContext)
  const { socketReconnect } = useSocketReconnect()

  useEffect(() => {
    socket.emit<SocketActionsType>('initialize')

    socket.on<SocketActionsType>('connection', () => {
      clg('success', 'Socket connected')
    })

    socket.on<SocketActionsType>('disconnect', () => {
      clg('error', 'Socket disconnected')
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

    return () => {
      socket.removeAllListeners()
    }
  }, [])
}
