import { onBeforeUnmount, onMounted } from 'vue'

import { useSocketConnect } from 'src/shared/api'

import { useCallDataUpdateMonitor } from './use-call-data-update-monitor.model'
import { useChatRoomUpdateMonitor } from './use-chat-room-update-monitor.model'
import { useContactUpdateMonitor } from './use-contact-update-monitor.model'
import { useMediaUpdateMonitor } from './use-media-update-monitor.model'
import { useMessageMonitor } from './use-message-monitor.model'
import { useSyncAvatars } from './use-sync-avatars.model'

export const useAppMonitors = () => {
  const { actualizeSocketData, socketConnect } = useSocketConnect()
  const { disposeCallDataUpdateMonitor, initializeCallDataUpdateMonitor } = useCallDataUpdateMonitor()
  const { disposeChatRoomUpdateMonitor, initializeChatRoomUpdateMonitor } = useChatRoomUpdateMonitor()
  const { disposeContactUpdateMonitor, initializeContactUpdateMonitor } = useContactUpdateMonitor()
  const { disposeMediaUpdateMonitor, initializeMediaUpdateMonitor } = useMediaUpdateMonitor()
  const { disposeMessageMonitor, initializeMessageMonitor } = useMessageMonitor()
  useSyncAvatars()

  onMounted(() => {
    initializeCallDataUpdateMonitor()
    initializeChatRoomUpdateMonitor()
    initializeContactUpdateMonitor()
    initializeMediaUpdateMonitor()
    initializeMessageMonitor()
    socketConnect()
    actualizeSocketData()
  })

  onBeforeUnmount(() => {
    disposeCallDataUpdateMonitor()
    disposeChatRoomUpdateMonitor()
    disposeContactUpdateMonitor()
    disposeMediaUpdateMonitor()
    disposeMessageMonitor()
  })
}
