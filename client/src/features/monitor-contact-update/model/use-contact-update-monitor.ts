import { useEffect } from 'react'

import { useAddContact } from 'src/features/add-contact'
import { useContactDataChange } from 'src/features/change-contact-data'
import { useContactActualize } from 'src/features/contact-actualize'
import { useDeleteContact } from 'src/features/delete-contact'
import { useLoadContacts } from 'src/features/load-contact'
import { useContactOnlineMonitor } from 'src/features/monitor-contact-online'
import { useContactTypingMonitor } from 'src/features/monitor-contact-typing'
import { useInviteSend } from 'src/features/send-invite'
import { useContactStatusUpdate } from 'src/features/update-contact-status'
import { useContactInteractionUpdate } from 'src/features/update-interaction'
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
