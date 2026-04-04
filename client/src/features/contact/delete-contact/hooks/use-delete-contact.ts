import { useState } from 'react'

import { SocketActionsType, IEventDeleteContactSuccess } from 'common'

import { useContact } from 'src/entities/contact'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'

export const useDeleteContact = () => {
  const [loading, setLoading] = useState(false)
  const { delete: deleteById } = useContact()
  const { startTimeout } = useTimeout()

  const deleteUserHandler = (contactId: string) => {
    setLoading(true)
    socket.emit<SocketActionsType>('update-contact-interaction-type', { contactId, interaction: 'default' })

    socket.once<SocketActionsType>('contact-delete-success', () => {
      startTimeout(() => setLoading(false), 400)
    })
  }

  const deleteContact = async (payload: IEventDeleteContactSuccess) => {
    await deleteById(payload.deletedContactId)
  }

  const monitorContactDeletion = () => {
    socket.on<SocketActionsType>('contact-delete-success', deleteContact)
  }

  return {
    deleteUserHandler,
    deleteContact,
    monitorContactDeletion,
    loading
  }
}
