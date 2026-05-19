import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import type { VirtualItem } from '@tanstack/vue-virtual'
import type { IFrontendContact } from 'global-shared'
import type { RouteLocationRaw } from 'vue-router'

import type { FChatRoomType } from 'src/shared/lib'
import type { DbMessageType } from 'src/shared/lib'

export interface IChatRoomNavigationItem {
  id: string
  to: RouteLocationRaw
  title: string
  description: string
  imageId: string
  online: boolean
  selected: boolean
  lastMessageCreatedAt: number
  unreadMessagesQuantity: number
}

export interface IChatRoomListProps {
  items: IChatRoomNavigationItem[]
}

export interface IChatRoomListItemProps {
  item: IChatRoomNavigationItem
}

export interface ICreateChatRoomContactItemProps {
  contactId: string
  nickname: string
}

export interface ICreateChatRoomDialogProps {
  modelValue: boolean
  chatAvatarUploadKey: number
  chatAvatarUploadValue: INmorphCustomFileData[]
  createChatNameInputValue: string
  contactSearchQuery: string
  isCreatingChat: boolean
  selectedContactIds: string[]
  acceptedContacts: IFrontendContact[]
  filteredAcceptedContacts: IFrontendContact[]
  isGroupChat: boolean
  canCreateChat: boolean
  showNoContactSearchResults: boolean
}

export type CreateChatRoomDialogEmitType = {
  (event: 'update:model-value', value: boolean): void
  (event: 'update:create-chat-name', value: string): void
  (event: 'update:contact-search-query', value: string): void
  (event: 'update:selected-contact-ids', value: string[]): void
  (event: 'update:chat-avatar', value: INmorphCustomFileData[]): void
  (event: 'unsupported-chat-avatar-format'): void
  (event: 'cancel'): void
  (event: 'create'): void
}

export interface IChatRoomMessagesProps {
  room: FChatRoomType
  isPrivateRoom: boolean
}

export interface IChatRoomHeaderProps {
  room: FChatRoomType
  isPrivateRoom: boolean
}

export interface IChatRoomFooterProps {
  room: FChatRoomType
}

export interface IMessageBodyProps {
  isPrivateRoom: boolean
  message: DbMessageType
}

export interface IDateSeparatorProps {
  label: string
}

export interface IMessageListLoadOlderItem {
  type: 'load-older'
  id: string
}

export interface IMessageListDateSeparatorItem {
  type: 'date-separator'
  id: string
  label: string
}

export interface IMessageListMessageItem {
  type: 'message'
  id: string
  messageId: string
}

export interface IMessageVirtualListMessageItem extends IMessageListMessageItem {
  message: DbMessageType
}

export type MessageListItemType = IMessageListLoadOlderItem | IMessageListDateSeparatorItem | IMessageListMessageItem

export type MessageVirtualListItemType =
  | IMessageListLoadOlderItem
  | IMessageListDateSeparatorItem
  | IMessageVirtualListMessageItem

export interface IMessageVirtualListItem {
  item: MessageVirtualListItemType
  virtualItem: VirtualItem
}
