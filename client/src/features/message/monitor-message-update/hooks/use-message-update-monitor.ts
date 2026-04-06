import { useEffect } from 'react'

import {
  useMessageStatusUpdate,
  useMessageDelivery,
  useMessageDelete,
  useMessageReactionUpdate
} from 'src/features/message'

export const useMessageUpdateMonitor = () => {
  const { monitorMessageDeletion } = useMessageDelete()
  const { monitorMessageDelivered } = useMessageDelivery()
  const { monitorMessageReactionUpdate } = useMessageReactionUpdate()
  const { monitorMessageStatus } = useMessageStatusUpdate()

  useEffect(() => {
    monitorMessageDeletion()
    monitorMessageDelivered()
    monitorMessageReactionUpdate()
    monitorMessageStatus()
  }, [])
}
