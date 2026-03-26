import { useEffect } from 'react'

import { useMessageDelete } from 'src/features/message/delete-message'
// import { useMessageSend } from 'src/features/message/send-message'
import { useMessageDelivery } from 'src/features/message/message-delivery-handler'
import { useMessageReactionUpdate } from 'src/features/message/update-message-reaction'
import { useMessageStatusUpdate } from 'src/features/message/update-message-status'

export const useMessageUpdateMonitor = () => {
  const { monitorMessageDeletion } = useMessageDelete()
  const { monitorMessageDelivered } = useMessageDelivery()
  // const { monitorMessageDelivered } = useMessageSend()
  const { monitorMessageReactionUpdate } = useMessageReactionUpdate()
  const { monitorMessageStatus } = useMessageStatusUpdate()

  useEffect(() => {
    monitorMessageDeletion()
    // monitorMessageDelivered()
    monitorMessageDelivered()
    monitorMessageReactionUpdate()
    monitorMessageStatus()
  }, [])
}
