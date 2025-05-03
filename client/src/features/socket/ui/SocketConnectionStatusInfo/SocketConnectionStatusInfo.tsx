import { useState, useEffect } from 'react'

import './style.scss'
import { useSystem } from 'src/entities/system'

import { socket } from 'src/shared/api'

export const SocketConnectionStatusInfo = () => {
  const { reconnecting } = useSystem()
  const [showDisconnected, setShowDisconnected] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (socket.disconnected) {
      timeoutId = setTimeout(() => setShowDisconnected(true), 2000)
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      setShowDisconnected(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [socket.disconnected])

  return (
    <>
      {showDisconnected && (
        <div className="socket-connection-status socket-connection-status--disconnected paragraph-text--error paragraph-text--md">
          DISCONNECTED
        </div>
      )}
      {reconnecting && (
        <div className="socket-connection-status socket-connection-status--connecting paragraph-text--accent paragraph-text--md">
          CONNECTING...
        </div>
      )}
    </>
  )
}
