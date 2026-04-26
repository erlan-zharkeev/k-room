import { onMounted } from 'vue'

import { useSocketConnect } from 'src/shared/api'

import { useCallDataUpdateMonitor } from './use-call-data-update-monitor'
import { useChatRoomUpdateMonitor } from './use-chat-room-update-monitor'
import { useContactUpdateMonitor } from './use-contact-update-monitor'
import { useInfoNotificationUpdateMonitor } from './use-info-notification-update-monitor'
import { useMessageUpdateMonitor } from './use-message-update-monitor'
import { useSyncAvatars } from './use-sync-avatars'

export const useMainMonitors = () => {
  const { actualizeSocketData } = useSocketConnect()
  const { initializeCallDataUpdateMonitor } = useCallDataUpdateMonitor()
  const { initializeChatRoomUpdateMonitor } = useChatRoomUpdateMonitor()
  const { initializeContactUpdateMonitor } = useContactUpdateMonitor()
  const { initializeInfoNotificationUpdateMonitor } = useInfoNotificationUpdateMonitor()
  const { initializeMessageUpdateMonitor } = useMessageUpdateMonitor()
  useSyncAvatars()

  onMounted(() => {
    initializeCallDataUpdateMonitor()
    initializeChatRoomUpdateMonitor()
    initializeContactUpdateMonitor()
    initializeInfoNotificationUpdateMonitor()
    initializeMessageUpdateMonitor()
    actualizeSocketData()
  })
}
