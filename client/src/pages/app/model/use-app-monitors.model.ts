import { onBeforeUnmount, onMounted } from 'vue'

import { useSocketConnect } from 'src/shared/api'

import { useChatRoomUpdateMonitor } from './use-chat-room-update-monitor.model'
import { useContactUpdateMonitor } from './use-contact-update-monitor.model'
import { useMediaUpdateMonitor } from './use-media-update-monitor.model'
import { useMessageMonitor } from './use-message-monitor.model'
import { useRoomCallDataUpdateMonitor } from './use-room-call-data-update-monitor.model'
import { useSyncAvatars } from './use-sync-avatars.model'

export const useAppMonitors = () => {
  const { actualizeSocketData, socketConnect } = useSocketConnect()
  const { disposeChatRoomUpdateMonitor, initializeChatRoomUpdateMonitor } = useChatRoomUpdateMonitor()
  const { disposeContactUpdateMonitor, initializeContactUpdateMonitor } = useContactUpdateMonitor()
  const { disposeMediaUpdateMonitor, initializeMediaUpdateMonitor } = useMediaUpdateMonitor()
  const { disposeMessageMonitor, initializeMessageMonitor } = useMessageMonitor()
  const { disposeRoomCallDataUpdateMonitor, initializeRoomCallDataUpdateMonitor } = useRoomCallDataUpdateMonitor()
  useSyncAvatars()

  onMounted(() => {
    initializeChatRoomUpdateMonitor()
    initializeContactUpdateMonitor()
    initializeMediaUpdateMonitor()
    initializeMessageMonitor()
    initializeRoomCallDataUpdateMonitor()
    socketConnect()
    actualizeSocketData()
  })

  onBeforeUnmount(() => {
    disposeChatRoomUpdateMonitor()
    disposeContactUpdateMonitor()
    disposeMediaUpdateMonitor()
    disposeMessageMonitor()
    disposeRoomCallDataUpdateMonitor()
  })
}
