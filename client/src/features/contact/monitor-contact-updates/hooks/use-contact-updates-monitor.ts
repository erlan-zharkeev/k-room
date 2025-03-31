import { useEffect } from 'react'
import { useAddContact } from '../../add-contact'
import { useDeleteContact } from '../../delete-contact'

export const useContactUpdatesMonitor = () => {
  const { listenContactDelete } = useDeleteContact()
  const { listenAddingContact } = useAddContact()

  const monitorContactUpdates = () => {
    useEffect(() => {
      listenContactDelete()
      listenAddingContact()
    }, [])
  }

  return {
    monitorContactUpdates
  }
}
