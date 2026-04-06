import { useEffect } from 'react'

import {
  useContactInteractionUpdate,
  useContactStatusUpdate,
  useInviteSend,
  useContactTypingMonitor,
  useContactOnlineMonitor,
  useLoadContacts,
  useDeleteContact,
  useContactActualize,
  useContactDataChange,
  useAddContact
} from './../../'

export const useContactUpdateMonitor = () => {
  const { monitorContactDeletion } = useDeleteContact()
  const { monitorContactAdding } = useAddContact()
  const { monitorContactsLoading } = useLoadContacts()
  const { monitorContactStatusUpdate } = useContactStatusUpdate()
  const { monitorContactDataChange } = useContactDataChange()
  const { monitorContactInteractionUpdate } = useContactInteractionUpdate()
  const { monitorInvitation } = useInviteSend()
  const { monitorContactTyping } = useContactTypingMonitor()
  const { monitorContactOnline } = useContactOnlineMonitor()
  const { monitorContactsActualize } = useContactActualize()

  useEffect(() => {
    monitorContactsActualize()
    monitorContactsLoading()
    monitorContactDeletion()
    monitorContactAdding()
    monitorContactStatusUpdate()
    monitorContactDataChange()
    monitorContactInteractionUpdate()
    monitorInvitation()
    monitorContactTyping()
    monitorContactOnline()
  }, [])
}
