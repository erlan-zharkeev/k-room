import { SocketActionsType } from 'common-types'
import { useState, useEffect, useRef } from 'react'
import { updateContactsStatusLocal, useContact } from 'src/entities/contact'
import { socket } from 'src/shared/api'

export const useContactOnlineMonitor = () => {
  const pingMonitorContactOnlineTimer = useRef<number | NodeJS.Timeout>()
  const [pingTimerCounter, updateTimerCounter] = useState<number>(0)
  const { contacts } = useContact()

  const checkForContactOnline = () => {
    socket.emit<SocketActionsType>('interlocutor-ping')
    const maxDiffSeconds = 30
    const currentTimestamp = Date.now()
    contacts.forEach((contact) => {
      const outOfInterval = Math.abs(currentTimestamp - contact.onlineStatusUpdatedTimestamp) / 1000 > maxDiffSeconds
      if (outOfInterval) {
        updateContactsStatusLocal({ contactId: contact.id, online: false })
      }
    })
  }

  const monitorContactsOnline = () => {
    pingMonitorContactOnlineTimer.current = setInterval(() => {
      updateTimerCounter((prev) => {
        const newValue = prev + 1
        return newValue
      })
    }, 5000)

    useEffect(() => {
      checkForContactOnline()

      return () => {
        if (pingMonitorContactOnlineTimer.current) {
          clearInterval(pingMonitorContactOnlineTimer.current)
        }
      }
    }, [pingTimerCounter])
  }

  return {
    monitorContactsOnline
  }
}
