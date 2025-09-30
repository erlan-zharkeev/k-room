import { SocketActionsType, IEventDeleteContactSuccess } from 'common-types'
import { useDispatch } from 'react-redux'

import { showModal, closeModal } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

export const useDeleteContact = () => {
  const dispatch = useDispatch()

  const deleteUserHandler = (id: string) => {
    dispatch(
      showModal({
        title: 'Confirmation',
        textContent: 'Are you sure want to delete this contact?',
        confirmBtn: {
          text: 'Delete',
          callback: () => deleteContactConfirmed(id)
        }
      })
    )
  }

  const deleteContactConfirmed = (contactId: string) => {
    socket.emit<SocketActionsType>('update-contact-interaction-type', { contactId, interaction: 'default' })
    dispatch(closeModal())
  }

  const deleteContact = async (payload: IEventDeleteContactSuccess) => {
    await db.contacts.delete(payload.deletedContactId)
  }

  const monitorContactDeletion = () => {
    socket.on<SocketActionsType>('contact-delete-success', deleteContact)
  }

  return {
    deleteUserHandler,
    deleteContact,
    monitorContactDeletion
  }
}
