import { useEffect } from 'react'

import { useMessageReactionUpdate } from 'src/features/message'
import { useMessageDelete } from 'src/features/message/delete-message'
import { useMessageDelivery } from 'src/features/message/message-delivery-handler'
import { useMessageStatusUpdate } from 'src/features/message/update-message-status'

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
