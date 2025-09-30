import { useMemo, useState } from 'react'

import { useContact } from 'src/entities/contact'

import { ContactAvatar } from '../ui'

export const usePickContact = () => {
  const { contacts } = useContact()
  const [pickedContactIds, setPickedContactIds] = useState<string[]>([])
  const [filterQuery, setFilterQuery] = useState('')

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

  return {
    filterQuery,
    setFilterQuery,
    contactListToPick,
    pickedContactIds,
    setPickedContactIds
  }
}
