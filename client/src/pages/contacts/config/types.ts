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
  createChat: [id: string]
  delete: [id: string]
  goToChat: [id: string]
  updateInteraction: [id: string, interaction: DbContactType['interactionType']]
}

export interface IContactContextMenuProps {
  contact: DbContactType
}

export interface IContactContextMenuEmits {
  delete: [id: string]
  updateInteraction: [id: string, interaction: DbContactType['interactionType']]
}

export interface IContactsDeleteDialogProps {
  modelValue: boolean
}

export interface IContactsDeleteDialogEmits {
  'update:modelValue': [value: boolean]
  cancel: []
  confirm: []
}

export type ContactListEmitType = {
  (event: 'createChat', id: string): void
  (event: 'delete', id: string): void
  (event: 'goToChat', id: string): void
  (event: 'updateInteraction', id: string, interaction: DbContactType['interactionType']): void
}

export type ContactContextMenuEmitType = {
  (event: 'delete', id: string): void
  (event: 'updateInteraction', id: string, interaction: DbContactType['interactionType']): void
}
