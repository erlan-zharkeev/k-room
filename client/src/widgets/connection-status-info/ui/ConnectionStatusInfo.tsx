import './style.scss'

import { useState, useEffect } from 'react'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'
import { useSystem } from 'src/shared/system'
import { AppText } from 'src/shared/ui'

export const ConnectionStatusInfo = () => {
  const { reconnecting, online } = useSystem()
  const [showDisconnected, setShowDisconnected] = useState(false)
  const { delay } = useTimeout()
  const [disconnectedText, setDisconnectedText] = useState('DISCONNECTED')

  const checkDisconnected = async () => {
    if (online) {
      if (socket.disconnected) {
        await delay(2000)
        if (!socket.disconnected) return
        setShowDisconnected(true)
        setDisconnectedText('DISCONNECTED')
      } else {
        setShowDisconnected(false)
      }
    } else {
      setShowDisconnected(true)
      setDisconnectedText('OFFLINE')
    }
  }

  useEffect(() => {
    checkDisconnected()
  }, [socket.disconnected, online])

  return (
    <>
      {showDisconnected && (
        <div className="connection-status connection-status--disconnected">
          <AppText color="error-color" size="small">
            {disconnectedText}
          </AppText>
        </div>
      )}
      {reconnecting && (
        <div className="connection-status connection-status--connecting">
          <AppText color="accent-color" size="small">
            Connecting...
          </AppText>
        </div>
      )}
    </>
  )
}
