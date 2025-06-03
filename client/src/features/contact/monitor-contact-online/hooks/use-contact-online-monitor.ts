import { useEffect, useState } from 'react'

import { SocketActionsType } from 'common-types'

import { updateContactsStatusLocal, useContact } from 'src/entities/contact'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'

export const useContactOnlineMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const { contacts } = useContact()
  const { startTimeout } = useTimeout()

  const checkForContactOnline = () => {
    socket.emit<SocketActionsType>('interlocutor-ping')

    const maxDiffSeconds = 30
    const currentTimestamp = Date.now()

    contacts.forEach((contact) => {
      const outdated = Math.abs(currentTimestamp - contact.onlineStatusUpdatedTimestamp) / 1000 > maxDiffSeconds

      if (outdated) {
        updateContactsStatusLocal({ contactId: contact.id, online: false })
      }
    })
  }

  useEffect(() => {
    if (isMonitoring) {
      startTimeout(() => checkForContactOnline, 10000)
    }
  }, [contacts, isMonitoring])

  const monitorContactOnline = () => {
    setIsMonitoring(true)
  }

  return { monitorContactOnline }
}
