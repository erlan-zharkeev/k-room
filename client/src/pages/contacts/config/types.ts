import type { LocalizedText } from 'global-shared'

import type { ContactRecord } from 'src/shared/lib'

export interface ContactsSearchProps {
  loadingContactIds: Set<string>
}

export interface ContactsSearchEmits {
  add: [id: string]
}

export interface ContactsSearchBadgeData {
  color: string
  label: LocalizedText
  visible: boolean
}

export interface ContactListProps {
  contactList: ContactRecord[]
  creatingChatContactIds: Set<string>
  getContactActivity: (contact: ContactRecord) => string
  getPersonalChatRoomId: (id: string) => string | undefined
  getContactStatus: (contact: ContactRecord) => string
  loadingContactIds: Set<string>
}

export interface ContactListEmits {
  'create-chat': [id: string]
  delete: [id: string]
  'go-to-chat': [id?: string]
  'update-interaction': [id: string, interaction: ContactRecord['interactionType']]
}

export interface ContactContextMenuProps {
  contact: ContactRecord
}

export interface ContactContextMenuEmits {
  delete: [id: string]
  'update-interaction': [id: string, interaction: ContactRecord['interactionType']]
}

export interface ContactContextMenuOption {
  label: string
  value: 'accept' | 'block' | 'delete' | 'unblock'
  color?: string
}

export interface ContactContextMenuEmitFn {
  (event: 'delete', id: string): void
  (event: 'update-interaction', id: string, interaction: ContactRecord['interactionType']): void
}

export interface ContactsDeleteDialogEmits {
  cancel: []
  confirm: []
}
