import { SocketActionsType, IEventGetContactTypingStatus } from 'common-types'
import { useDispatch } from 'react-redux'

import { updateContactTypingStatus } from 'src/entities/contact'

import { socket } from 'src/shared/api'

export const useContactTypingMonitor = () => {
  const dispatch = useDispatch()

  const monitorContactTyping = () => {
    socket.on<SocketActionsType>('get-contact-typing-status', (payload: IEventGetContactTypingStatus) => {
      dispatch(updateContactTypingStatus(payload))
    })
  }

  return { monitorContactTyping }
}
