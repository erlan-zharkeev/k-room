import { useEffect } from 'react'

import { useMessageReactionUpdate } from '../..'
import { useMessageDelete } from '../../delete-message'
import { useMessageDelivery } from '../../message-delivery-handler'
import { useMessageStatusUpdate } from '../../update-message-status'

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
