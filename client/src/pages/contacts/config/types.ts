import type { Ref } from 'vue'

import type { DbContactType } from 'src/shared/lib'

export interface IUseContactSearchParams {
  searchQuery: Ref<string>
}

export interface IContactsSearchProps {
  searchQuery: string
  loadingContactIds: Set<string>
  isContactExist: (id: string) => boolean
}

export interface IContactsSearchEmits {
  add: [id: string]
}

export interface IContactListProps {
  contactList: DbContactType[]
  creatingChatContactIds: Set<string>
  getContactDescription: (contact: DbContactType) => string
  getPersonalChatRoomId: (id: string) => string | undefined
  loadingContactIds: Set<string>
}

export interface IContactListEmits {
  createChat: [id: string]
  delete: [id: string]
  goToChat: [id: string]
  updateInteraction: [id: string, interaction: DbContactType['interactionType']]
}

export type ContactListEmitType = {
  (event: 'createChat', id: string): void
  (event: 'delete', id: string): void
  (event: 'goToChat', id: string): void
  (event: 'updateInteraction', id: string, interaction: DbContactType['interactionType']): void
}
