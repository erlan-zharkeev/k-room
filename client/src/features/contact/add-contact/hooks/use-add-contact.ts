import { useState } from 'react'

import { IEventContactAddSuccess, SocketActionsType } from 'common-types'

import { useContact } from 'src/entities/contact'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'

import { getRequiredContactSystemData } from '../../lib'

export const useAddContact = () => {
  const { id } = useUser()
  const [loading, setLoading] = useState(false)
  const { update: updateContact } = useContact()
  const { startTimeout } = useTimeout()

  const clickAddContactHandler = async (interlocutorId: string | undefined) => {
    if (!interlocutorId) return
    setLoading(true)
    socket.emit<SocketActionsType>('save-contact', { userId: id, interlocutorId })

    socket.on<SocketActionsType>('contact-add-success', (data: IEventContactAddSuccess) => {
      startTimeout(() => setLoading(false), 400)
      addContact(data)
    })
  }

  const addContact = async (payload: IEventContactAddSuccess) => {
    const newContact = { ...payload.contactData, ...getRequiredContactSystemData() }
    updateContact(newContact.id, newContact)
  }

  const monitorContactAdding = () => {
    socket.on<SocketActionsType>('contact-add-success', addContact)
  }

  return {
    clickAddContactHandler,
    monitorContactAdding,
    addContact,
    loading
  }
}
