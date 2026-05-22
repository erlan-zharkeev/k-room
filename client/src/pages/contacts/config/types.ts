import type { LocalizedTextType } from 'global-shared'

import type { ContactRecordType } from 'src/shared/lib'

export interface IContactsSearchProps {
  loadingContactIds: Set<string>
}

export interface IContactsSearchEmits {
  add: [id: string]
}

export interface IContactsSearchBadgeData {
  color: string
  label: LocalizedTextType
  visible: boolean
}

export interface IContactListProps {
  contactList: ContactRecordType[]
  creatingChatContactIds: Set<string>
  getContactActivity: (contact: ContactRecordType) => string
  getPersonalChatRoomId: (id: string) => string | undefined
  getContactStatus: (contact: ContactRecordType) => string
  loadingContactIds: Set<string>
}

export interface IContactListEmits {
  'create-chat': [id: string]
  delete: [id: string]
  'go-to-chat': [id?: string]
  'update-interaction': [id: string, interaction: ContactRecordType['interactionType']]
}

export interface IContactContextMenuProps {
  contact: ContactRecordType
}

export interface IContactContextMenuEmits {
  delete: [id: string]
  'update-interaction': [id: string, interaction: ContactRecordType['interactionType']]
}

export interface IContactContextMenuOption {
  label: string
  value: 'accept' | 'block' | 'delete' | 'unblock'
  color?: string
}

export interface IContactContextMenuEmitFn {
  (event: 'delete', id: string): void
  (event: 'update-interaction', id: string, interaction: ContactRecordType['interactionType']): void
}

export interface IContactsDeleteDialogEmits {
  cancel: []
  confirm: []
}
