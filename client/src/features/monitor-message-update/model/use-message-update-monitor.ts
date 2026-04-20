import { useEffect } from 'react'

import { useMessageDelete } from 'src/features/delete-message'
import { useMessageDelivery } from 'src/features/message-delivery-handler'
import { useMessageReactionUpdate } from 'src/features/update-message-reaction'
import { useMessageStatusUpdate } from 'src/features/update-message-status'

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
