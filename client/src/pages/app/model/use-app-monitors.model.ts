import { onBeforeUnmount, onMounted } from 'vue'

import { useRoomCallDataUpdateMonitor } from 'src/entities/room-call'
import { useActiveRoomCallSession } from 'src/features/room-call-session'
import { useSocketConnect } from 'src/shared/api'

import { useAppBadge } from './use-app-badge.model'
import { useChatRoomUpdateMonitor } from './use-chat-room-update-monitor.model'
import { useContactUpdateMonitor } from './use-contact-update-monitor.model'
import { useMediaUpdateMonitor } from './use-media-update-monitor.model'
import { useMessageMonitor } from './use-message-monitor.model'
import { useMissedRoomCallSeenSync } from './use-missed-room-call-seen-sync.model'
import { useNotificationForegroundSync } from './use-notification-foreground-sync.model'
import { useRoomCallNotificationMonitor } from './use-room-call-notification-monitor.model'
import { useSyncAvatars } from './use-sync-avatars.model'
import { useWebPushSubscription } from './use-web-push-subscription.model'

export const useAppMonitors = () => {
  const { actualizeSocketData, socketConnect } = useSocketConnect()
  const { disposeChatRoomUpdateMonitor, initializeChatRoomUpdateMonitor } = useChatRoomUpdateMonitor()
  const { disposeContactUpdateMonitor, initializeContactUpdateMonitor } = useContactUpdateMonitor()
  const { disposeMediaUpdateMonitor, initializeMediaUpdateMonitor } = useMediaUpdateMonitor()
  const { disposeMessageMonitor, initializeMessageMonitor } = useMessageMonitor()
  const { disposeRoomCallDataUpdateMonitor, initializeRoomCallDataUpdateMonitor } = useRoomCallDataUpdateMonitor()
  const { disposeRoomCallNotificationMonitor, initializeRoomCallNotificationMonitor } = useRoomCallNotificationMonitor()
  useAppBadge()
  useNotificationForegroundSync()
  useMissedRoomCallSeenSync()
  useActiveRoomCallSession()
  useSyncAvatars()
  useWebPushSubscription()

  onMounted(() => {
    initializeChatRoomUpdateMonitor()
    initializeContactUpdateMonitor()
    initializeMediaUpdateMonitor()
    initializeMessageMonitor()
    initializeRoomCallDataUpdateMonitor()
    initializeRoomCallNotificationMonitor()
    socketConnect()
    actualizeSocketData()
  })

  onBeforeUnmount(() => {
    disposeChatRoomUpdateMonitor()
    disposeContactUpdateMonitor()
    disposeMediaUpdateMonitor()
    disposeMessageMonitor()
    disposeRoomCallDataUpdateMonitor()
    disposeRoomCallNotificationMonitor()
  })
}
