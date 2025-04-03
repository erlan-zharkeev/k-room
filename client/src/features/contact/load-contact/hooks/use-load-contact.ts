import { SocketActionsType, IEventGetContacts } from 'common-types'
import { useDispatch } from 'react-redux'
import { socket } from 'src/shared/api'
import { loadContacts } from 'src/entities/contact'

export const useLoadContacts = () => {
  const dispatch = useDispatch()

  const monitorContactsLoading = () => {
    socket.on<SocketActionsType>('contacts-loaded', ({ contacts }: IEventGetContacts) => {
      dispatch(loadContacts(contacts))
    })
  }

  return { monitorContactsLoading }
}
