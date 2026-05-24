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
  isCreatingChat: boolean
  isUpdatingContact: boolean
  personalChatRoomId?: string
}

export interface ContactContextMenuEmits {
  'create-chat': [id: string]
  delete: [id: string]
  'go-to-chat': [id?: string]
  'update-interaction': [id: string, interaction: ContactRecord['interactionType']]
}

export interface ContactContextMenuOption {
  label: string
  value: 'accept' | 'block' | 'create-chat' | 'delete' | 'go-to-chat' | 'invite' | 'unblock'
  color?: string
  disabled?: boolean
}

export interface ContactContextMenuEmitFn {
  (event: 'create-chat', id: string): void
  (event: 'delete', id: string): void
  (event: 'go-to-chat', id?: string): void
  (event: 'update-interaction', id: string, interaction: ContactRecord['interactionType']): void
}

export interface ContactsDeleteDialogEmits {
  cancel: []
  confirm: []
}
