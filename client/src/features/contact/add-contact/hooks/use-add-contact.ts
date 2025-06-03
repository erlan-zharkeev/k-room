import { IEventContactAddSuccess, IUserData, SocketActionsType } from 'common-types'
import { useDispatch } from 'react-redux'

import { addContact } from 'src/entities/contact'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'

export const useAddContact = () => {
  const { id } = useUser()
  const dispatch = useDispatch()

  const clickAddContactHandler = async (interlocutorId: string | undefined, searchedContacts: IUserData[]) => {
    if (!interlocutorId) return
    const interlocutorData = searchedContacts.find((user) => user.id === interlocutorId)
    if (!interlocutorData) return
    socket.emit<SocketActionsType>('save-contact', { userId: id, interlocutorId: interlocutorData.id })
  }

  const monitorContactAdding = () => {
    socket.on<SocketActionsType>('contact-add-success', (payload: IEventContactAddSuccess) => {
      dispatch(addContact(payload))
    })
  }

  return {
    clickAddContactHandler,
    monitorContactAdding
  }
}
