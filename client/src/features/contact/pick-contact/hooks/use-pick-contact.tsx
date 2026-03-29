import { useMemo, useState } from 'react'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'

import { ContactAvatar } from '..'

export const usePickContact = () => {
  const { contacts } = useContact()
  const [pickedContactIds, setPickedContactIds] = useState<string[]>([])
  const [filterQuery, setFilterQuery] = useState('')
  const { getPersonalRoomByContactId } = useChatRoom()

  const contactListToPick = useMemo(() => {
    const q = filterQuery.trim().toLowerCase()

    return contacts
      .filter((c) => c.interactionType === 'invite-accepted')
      .filter((c) => !q || c.username.toLowerCase().includes(q))
      .map((c) => ({
        label: c.username,
        value: c.id,
        prefixSlot: <ContactAvatar id={c.id} />
      }))
  }, [contacts, filterQuery])

  const isPrivateChatAlreadyExists = useMemo(() => {
    if (pickedContactIds.length !== 1) return false
    return Boolean(getPersonalRoomByContactId(pickedContactIds[0]))
  }, [pickedContactIds, getPersonalRoomByContactId])

  return {
    filterQuery,
    setFilterQuery,
    contactListToPick,
    pickedContactIds,
    setPickedContactIds,
    isPrivateChatAlreadyExists
  }
}
