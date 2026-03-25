import { useEffect, useRef, useState } from 'react'

import { SocketActionsType } from 'common'

import { useContact } from 'src/entities/contact'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'

import { useUpdateContactData } from '../../update-contact-data'

export const useContactOnlineMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const { contacts } = useContact()
  const { updateContactData } = useUpdateContactData()

  const { startInterval, stopInterval } = useTimeout()
  // Keep the latest contacts accessible to the interval callback without restarting the interval on every update.
  const contactsRef = useRef(contacts)

  useEffect(() => {
    contactsRef.current = contacts
  }, [contacts])

  const checkForContactOnline = () => {
    socket.emit<SocketActionsType>('interlocutor-ping')

    const maxDiffSeconds = 30
    const currentTimestamp = Date.now()

    contactsRef.current.forEach((contact) => {
      const outdated = Math.abs(currentTimestamp - contact.onlineStatusSyncedAt) / 1000 > maxDiffSeconds

      if (outdated) {
        updateContactData(contact.id, { online: false })
      }
    })
  }

  useEffect(() => {
    if (isMonitoring) {
      startInterval(checkForContactOnline, 10000)
    }

    return () => {
      stopInterval()
    }
  }, [isMonitoring])

  const monitorContactOnline = () => {
    setIsMonitoring(true)
  }

  return { monitorContactOnline }
}
