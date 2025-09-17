import { useMemo, useState } from 'react'

import { useContact } from 'src/entities/contact'

import { AppAvatar } from 'src/shared/ui'

export const usePickContact = () => {
  const { contacts } = useContact()
  const [pickedContactIds, setPickedContactIds] = useState<string[]>([])

  const contactListToPick = useMemo(
    () =>
      contacts
        .filter((contact) => contact.interactionType === 'invite-accepted')
        .map((contact) => ({
          label: contact.username,
          value: contact.id,
          prefixSlot: <AppAvatar src={''} showBadge={false} />
        })),
    [contacts]
  )

  return {
    contactListToPick,
    pickedContactIds,
    setPickedContactIds
  }
}
