import { useEffect } from 'react'

import { useMessageDelete } from '../../delete-message'
// import { useMessageSend } from '../../send-message'
import { useMessageDelivery } from '../../message-delivery-handler'
import { useMessageReactionUpdate } from '../../update-message-reaction'
import { useMessageStatusUpdate } from '../../update-message-status'

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
