import type { LocalizedTextType } from 'global-shared'

import type { DbUserContactType } from 'src/shared/lib'

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
  contactList: DbUserContactType[]
  creatingChatContactIds: Set<string>
  getContactActivity: (contact: DbUserContactType) => string
  getPersonalChatRoomId: (id: string) => string | undefined
  getContactStatus: (contact: DbUserContactType) => string
  loadingContactIds: Set<string>
}

export interface IContactListEmits {
  'create-chat': [id: string]
  delete: [id: string]
  'go-to-chat': [id?: string]
  'update-interaction': [id: string, interaction: DbUserContactType['interactionType']]
}

export interface IContactContextMenuProps {
  contact: DbUserContactType
}

export interface IContactContextMenuEmits {
  delete: [id: string]
  'update-interaction': [id: string, interaction: DbUserContactType['interactionType']]
}

export interface IContactContextMenuOption {
  label: string
  value: 'accept' | 'block' | 'delete' | 'unblock'
  color?: string
}

export interface IContactContextMenuEmitFn {
  (event: 'delete', id: string): void
  (event: 'update-interaction', id: string, interaction: DbUserContactType['interactionType']): void
}

export interface IContactsDeleteDialogEmits {
  cancel: []
  confirm: []
}
