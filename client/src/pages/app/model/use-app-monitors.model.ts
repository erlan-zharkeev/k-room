import { onMounted } from 'vue'

import { useSocketConnect } from 'src/shared/api'

import { useCallDataUpdateMonitor } from './use-call-data-update-monitor.model'
import { useChatRoomUpdateMonitor } from './use-chat-room-update-monitor.model'
import { useContactUpdateMonitor } from './use-contact-update-monitor.model'
import { useMessageUpdateMonitor } from './use-message-update-monitor.model'
import { useSyncAvatars } from './use-sync-avatars.model'

export const useAppMonitors = () => {
  const { actualizeSocketData } = useSocketConnect()
  const { initializeCallDataUpdateMonitor } = useCallDataUpdateMonitor()
  const { initializeChatRoomUpdateMonitor } = useChatRoomUpdateMonitor()
  const { initializeContactUpdateMonitor } = useContactUpdateMonitor()
  const { initializeMessageUpdateMonitor } = useMessageUpdateMonitor()
  useSyncAvatars()

  onMounted(() => {
    initializeCallDataUpdateMonitor()
    initializeChatRoomUpdateMonitor()
    initializeContactUpdateMonitor()
    initializeMessageUpdateMonitor()
    actualizeSocketData()
  })
}
