import { useEffect } from 'react'

import { useSyncMedia } from 'src/features/media'

import { useContact } from 'src/entities/contact'
import { useUser } from 'src/entities/user'

export const useSyncAvatars = () => {
  const { contacts } = useContact()
  const { sync } = useSyncMedia()
  const user = useUser()

  const syncContactAvatars = () => {
    contacts.forEach((contact) => {
      sync(`avatar.${contact.id}`)
    })
  }

  const syncUserAvatar = () => {
    sync(`avatar.${user.id}`)
  }

  useEffect(() => {
    if (!user.id) return
    syncUserAvatar()
  }, [user.id])

  useEffect(() => {
    if (!contacts.length || !user.id) return
    syncContactAvatars()
  }, [contacts.map(c => c.id).sort().join('|'), user.id])
}
