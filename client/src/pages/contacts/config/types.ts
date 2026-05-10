import type { LocalizedTextType } from 'global-shared'

import type { DbContactType } from 'src/shared/lib'

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
  contactList: DbContactType[]
  creatingChatContactIds: Set<string>
  getContactActivity: (contact: DbContactType) => string
  getPersonalChatRoomId: (id: string) => string | undefined
  getContactStatus: (contact: DbContactType) => string
  loadingContactIds: Set<string>
}

export interface IContactListEmits {
  'create-chat': [id: string]
  delete: [id: string]
  'go-to-chat': [id?: string]
  'update-interaction': [id: string, interaction: DbContactType['interactionType']]
}

export interface IContactContextMenuProps {
  contact: DbContactType
}

export interface IContactContextMenuEmits {
  delete: [id: string]
  'update-interaction': [id: string, interaction: DbContactType['interactionType']]
}

export interface IContactsDeleteDialogProps {
  modelValue: boolean
}

export interface IContactsDeleteDialogEmits {
  'update:model-value': [value: boolean]
  cancel: []
  confirm: []
}
