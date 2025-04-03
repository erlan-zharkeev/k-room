import { useEffect } from 'react'
import { useMessageDelete } from '../../delete-message'
import { useMessageSend } from '../../send-message'
import { useMessageReactionUpdate } from '../../update-message-reaction'
import { useMessageStatusUpdate } from '../../update-message-status'

export const useMessageUpdateMonitor = () => {
  const { monitorMessageDeletion } = useMessageDelete()
  const { monitorMessageDelivered } = useMessageSend()
  const { monitorMessageReactionUpdate } = useMessageReactionUpdate()
  const { monitorMessageStatus } = useMessageStatusUpdate()

  const monitorMessageUpdate = () => {
    useEffect(() => {
      monitorMessageDeletion()
      monitorMessageDelivered()
      monitorMessageReactionUpdate()
      monitorMessageStatus()
    }, [])
  }

  return {
    monitorMessageUpdate
  }
}
