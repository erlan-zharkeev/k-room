import './style.scss'
import { useMemo } from 'react'
import { useCall } from 'src/entities/call'
import { useSettings } from 'src/entities/settings'
import { AsidePanel } from 'src/widgets/aside-panel'
import { ChatRoom } from 'src/widgets/chat-room'
import { InfoList } from 'src/widgets/info'

export const Content = () => {
  const { selectedContentElement } = useSettings()
  const callData = useCall()

  const rootClassName = useMemo(() => {
    return callData.isMinified ? 'content content--with-minified-call-window' : 'content'
  }, [callData.isMinified])

  return (
    <>
      {selectedContentElement === 'info' ? (
        <div className={rootClassName}>{selectedContentElement === 'info' && <InfoList />}</div>
      ) : (
        <div className={rootClassName}>
          <AsidePanel />
          <ChatRoom />
        </div>
      )}
    </>
  )
}
