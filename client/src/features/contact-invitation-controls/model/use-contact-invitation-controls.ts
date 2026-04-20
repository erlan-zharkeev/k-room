import { useEffect, useState } from 'react'

import { InteractionType, IEventUpdateInteraction, SocketActionsType } from 'common'

import { useContact } from 'src/entities/contact'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'

export const useContactInvitationControls = () => {
  const { contacts } = useContact()
  const [loaders, setLoaders] = useState<Record<string, boolean>>({})
  const { startTimeout: inviteTimer } = useTimeout()
  const { startTimeout: contactsUpdatedTimer } = useTimeout()

  const updateInteractionType = (contactId: string, interaction: InteractionType) => {
    setLoaders((prev) => ({ ...prev, [contactId]: true }))
    const payload: IEventUpdateInteraction = { contactId, interaction }
    inviteTimer(() => {
      socket.emit<SocketActionsType>('update-contact-interaction-type', payload) // Fake delay for smooth ui
    }, 1000)
  }

  useEffect(() => {
    if (!contacts) return
    const updatedContacts = contacts.filter((contact) => loaders[contact.id])
    if (updatedContacts.length > 0) {
      const newLoaders = { ...loaders }
      updatedContacts.forEach((contact) => {
        newLoaders[contact.id] = false
      })
      contactsUpdatedTimer(() => setLoaders(newLoaders), 1000) // Fake delay for smooth ui
    }
  }, [contacts])

  return { loaders, updateInteractionType }
}
