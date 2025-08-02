import { ContactType } from 'common-types'

export type SliceContact = ContactType & { onlineStatusUpdatedTimestamp: number; isTyping: boolean }

export interface IContactsState {
  contacts: SliceContact[]
}
