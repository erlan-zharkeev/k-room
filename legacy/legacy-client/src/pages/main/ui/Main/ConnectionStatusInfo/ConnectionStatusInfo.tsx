import './style.scss'

import { useState, useEffect } from 'react'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'
import { useSystem } from 'src/shared/system'
import { AppText } from 'src/shared/ui'

import { CONNECTION_STATUS_INFO_I18N } from './i18n'

type DisconnectedStatus = 'disconnected' | 'offline'

export const ConnectionStatusInfo = () => {
  const { reconnecting, online } = useSystem()
  const { t } = useI18n()
  const [showDisconnected, setShowDisconnected] = useState(false)
  const { delay } = useTimeout()
  const [disconnectedStatus, setDisconnectedStatus] = useState<DisconnectedStatus>('disconnected')

  const checkDisconnected = async () => {
    if (online) {
      if (socket.disconnected) {
        await delay(2000)
        if (!socket.disconnected) return
        setShowDisconnected(true)
        setDisconnectedStatus('disconnected')
      } else {
        setShowDisconnected(false)
      }
    } else {
      setShowDisconnected(true)
      setDisconnectedStatus('offline')
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
            {t(CONNECTION_STATUS_INFO_I18N[disconnectedStatus])}
          </AppText>
        </div>
      )}
      {reconnecting && (
        <div className="connection-status connection-status--connecting">
          <AppText color="accent-color" size="small">
            {t(CONNECTION_STATUS_INFO_I18N.connecting)}
          </AppText>
        </div>
      )}
    </>
  )
}
