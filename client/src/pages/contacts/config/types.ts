import type { Component } from 'vue'

import type { ContactRecord, I18nKey } from 'src/shared/lib'
import type { AppTextColor } from 'src/shared/ui'

export interface ContactsSearchProps {
  loadingContactIds: Set<string>
}

export interface ContactsSearchEmits {
  add: [id: string]
}

export interface ContactsSearchBadgeData {
  color: string
  label: I18nKey
  visible: boolean
}

export interface ContactListProps {
  contactList: ContactRecord[]
  creatingChatContactIds: Set<string>
  isContactActivityVisible: (contact: ContactRecord) => boolean
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

export type ContactContextMenuAction =
  | 'accept'
  | 'block'
  | 'create-chat'
  | 'delete'
  | 'go-to-chat'
  | 'invite'
  | 'unblock'

export interface ContactContextMenuEmits {
  'create-chat': [id: string]
  delete: [id: string]
  'go-to-chat': [id?: string]
  'update-interaction': [id: string, interaction: ContactRecord['interactionType']]
}

export interface ContactContextMenuOption {
  label?: string
  value: ContactContextMenuAction
  component?: Component
  componentProps?: Record<string, unknown>
  closeOnClick?: boolean
  color?: AppTextColor
  disabled?: boolean
}

export interface ContactContextMenuEmitFn {
  (event: 'create-chat', id: string): void
  (event: 'delete', id: string): void
  (event: 'go-to-chat', id?: string): void
  (event: 'update-interaction', id: string, interaction: ContactRecord['interactionType']): void
}

export interface ContactContextMenuActionItemProps {
  action: ContactContextMenuAction
  color?: AppTextColor
  contactId: string
  createChat: (id: string) => void
  deleteContact: (id: string) => void
  disabled?: boolean
  goToChat: (id?: string) => void
  label: string
  personalChatRoomId?: string
  updateInteraction: (id: string, interaction: ContactRecord['interactionType']) => void
}

export interface ContactContextMenuActionItemEmits {
  select: []
}

export type ContactContextMenuActionItemEmitFn = (event: 'select') => void

export interface ContactsDeleteDialogEmits {
  cancel: []
  confirm: []
}
