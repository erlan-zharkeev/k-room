import { useEffect } from 'react'

import { useAddContact } from '../../add-contact'
import { useContactDataChange } from '../../change-contact-data'
import { useContactActualize } from '../../contact-actualize'
import { useDeleteContact } from '../../delete-contact'
import { useLoadContacts } from '../../load-contact'
import { useContactOnlineMonitor } from '../../monitor-contact-online'
import { useContactTypingMonitor } from '../../monitor-contact-typing'
import { useInviteSend } from '../../send-invite'
import { useContactStatusUpdate } from '../../update-contact-status'
import { useContactInteractionUpdate } from '../../update-interaction'

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
