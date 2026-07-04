import type { Contact } from 'global-shared'

import { mergeContactLocalState, useContact } from 'src/entities/contact'

import { useContactInvitationNotification } from './use-contact-invitation-notification.model'

export const useContactInvitationReceiver = () => {
  const { get: getContact, put: putContact } = useContact()
  const { notifyInviteReceived } = useContactInvitationNotification()

  const processInviteReceived = async (contact: Contact) => {
    const existingContact = await getContact(contact.id)

    await putContact(mergeContactLocalState(existingContact, contact))
    notifyInviteReceived(contact)
  }

  return {
    processInviteReceived
  }
}
