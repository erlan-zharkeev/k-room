import { useEffect } from 'react'

import { useAddContact } from 'src/features/contact/add-contact'
import { useContactDataChange } from 'src/features/contact/change-contact-data'
import { useContactActualize } from 'src/features/contact/contact-actualize'
import { useDeleteContact } from 'src/features/contact/delete-contact'
import { useLoadContacts } from 'src/features/contact/load-contact'
import { useContactOnlineMonitor } from 'src/features/contact/monitor-contact-online'
import { useContactTypingMonitor } from 'src/features/contact/monitor-contact-typing'
import { useInviteSend } from 'src/features/contact/send-invite'
import { useContactStatusUpdate } from 'src/features/contact/update-contact-status'
import { useContactInteractionUpdate } from 'src/features/contact/update-interaction'

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
