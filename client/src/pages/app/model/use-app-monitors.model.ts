import { onMounted } from 'vue'

import { useMessageMonitor } from 'src/features/message-monitor'
import { useSocketConnect } from 'src/shared/api'

import { useCallDataUpdateMonitor } from './use-call-data-update-monitor.model'
import { useChatRoomUpdateMonitor } from './use-chat-room-update-monitor.model'
import { useContactUpdateMonitor } from './use-contact-update-monitor.model'
import { useSyncAvatars } from './use-sync-avatars.model'

export const useAppMonitors = () => {
  const { actualizeSocketData, socketConnect } = useSocketConnect()
  const { initializeCallDataUpdateMonitor } = useCallDataUpdateMonitor()
  const { initializeChatRoomUpdateMonitor } = useChatRoomUpdateMonitor()
  const { initializeContactUpdateMonitor } = useContactUpdateMonitor()
  const { initializeMessageMonitor } = useMessageMonitor()
  useSyncAvatars()

  onMounted(() => {
    initializeCallDataUpdateMonitor()
    initializeChatRoomUpdateMonitor()
    initializeContactUpdateMonitor()
    initializeMessageMonitor()
    socketConnect()
    actualizeSocketData()
  })
}
