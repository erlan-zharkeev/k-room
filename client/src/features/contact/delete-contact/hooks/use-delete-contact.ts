import { SocketActionsType, IEventDeleteContactSuccess } from 'common-types'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

export const useDeleteContact = () => {
  const deleteUserHandler = (id: string) => {
    if (!window.confirm('Are you sure want to delete this contact?')) return
    deleteContactConfirmed(id)
  }

  const deleteContactConfirmed = (contactId: string) => {
    socket.emit<SocketActionsType>('update-contact-interaction-type', { contactId, interaction: 'default' })
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
