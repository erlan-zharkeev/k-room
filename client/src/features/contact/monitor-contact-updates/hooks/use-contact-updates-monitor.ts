import { useEffect } from 'react'
import { useAddContact } from '../../add-contact'
import { useDeleteContact } from '../../delete-contact'
import { useLoadContacts } from '../../load-contact'
import { useContactStatusUpdate } from '../../update-contact-status/hooks/use-contact-status-update'
import { useContactDataChange } from '../../change-contact-data'
import { useContactInteractionUpdate } from '../../update-intercation'
import { useInviteSend } from '../../send-invite'

export const useContactUpdatesMonitor = () => {
  const { monitorContactDeletion } = useDeleteContact()
  const { monitorContactAdding } = useAddContact()
  const { monitorContactsLoading } = useLoadContacts()
  const { monitorContactStatusUpdate } = useContactStatusUpdate()
  const { monitorContactDataChange } = useContactDataChange()
  const { monitorContactInteractionUpdate } = useContactInteractionUpdate()
  const { monitorInvitationReceipt } = useInviteSend()

  const monitorContactUpdate = () => {
    useEffect(() => {
      monitorContactsLoading()
      monitorContactDeletion()
      monitorContactAdding()
      monitorContactStatusUpdate()
      monitorContactDataChange()
      monitorContactInteractionUpdate()
      monitorInvitationReceipt()
    }, [])
  }

  return {
    monitorContactUpdate
  }
}
