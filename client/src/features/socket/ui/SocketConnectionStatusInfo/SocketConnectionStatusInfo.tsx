import { useState, useEffect } from 'react'

import './style.scss'
import { useSystem } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'

export const SocketConnectionStatusInfo = () => {
  const { reconnecting } = useSystem()
  const [showDisconnected, setShowDisconnected] = useState(false)
  const { delay } = useTimeout()

  const checkDisconnected = async () => {
    if (socket.disconnected) {
      await delay(2000)
      if (socket.disconnected) setShowDisconnected(true)
    } else {
      setShowDisconnected(false)
    }
  }

  useEffect(() => {
    checkDisconnected()
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
