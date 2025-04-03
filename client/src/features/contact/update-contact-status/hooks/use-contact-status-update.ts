import { SocketActionsType, IEventStatusContact } from 'common-types'
import { useDispatch } from 'react-redux'
import { updateContactsStatus } from 'src/entities/contact'
import { socket } from 'src/shared/api'

export const useContactStatusUpdate = () => {
  const dispatch = useDispatch()

  const monitorContactStatusUpdate = () => {
    socket.on<SocketActionsType>('contact-status-updated', (payload: IEventStatusContact) => {
      dispatch(updateContactsStatus(payload))
    })
  }
  return { monitorContactStatusUpdate }
}
