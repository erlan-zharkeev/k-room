import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import type { ChatRoom } from 'global-shared'
import type { Component, Ref } from 'vue'

export type ChatRoomContextMenuItem = Pick<
  ChatRoom,
  'adminId' | 'chatKind' | 'id' | 'isMuted' | 'isPinned' | 'unreadMessagesQuantity'
>

export interface ChatRoomContextMenuProps {
  actionOptions?: ChatRoomContextMenuOption[]
  item: ChatRoomContextMenuItem
}

export type ChatRoomContextMenuAction =
  | 'mark-as-read'
  | 'pin-chat'
  | 'unpin-chat'
  | 'mute-chat'
  | 'unmute-chat'
  | 'edit-group'
  | 'delete-chat'
  | 'leave-group'

export interface ChatRoomContextMenuOption {
  label?: string
  value: ChatRoomContextMenuAction | string
  component?: Component
  componentProps?: Record<string, unknown>
  closeOnClick?: boolean
  disabled?: boolean
}

export interface ChatRoomContextMenuEmits {
  'edit-group': []
  'delete-chat': []
  'leave-group': []
}

export interface ChatRoomContextMenuEmitFn {
  (event: 'edit-group'): void
  (event: 'delete-chat'): void
  (event: 'leave-group'): void
}

export interface ChatRoomDeleteDialogProps {
  item: ChatRoomContextMenuItem
}

export interface ChatRoomLeaveDialogProps {
  item: ChatRoomContextMenuItem
}

export interface ChatRoomFormDialogProps {
  roomId?: string
}

export interface ChatRoomFormData {
  chatRoomName?: string
  chatAvatarFile?: File
  selectedMemberIds: string[]
}

export interface ChatRoomFormState {
  chatAvatarUploadValue: INmorphCustomFileData[]
  hasInitialChatAvatar: boolean
  chatAvatarWasDeleted: boolean
  isSavingChatRoom: boolean
}

export interface ChatRoomFormAvatarParams {
  chatRoomFormData: ChatRoomFormData
  chatRoomFormState: ChatRoomFormState
  isChatRoomFormDialogOpen: Ref<boolean>
  isEditMode: Readonly<Ref<boolean>>
  roomId: Ref<string | undefined>
}

export type ChatRoomFormDialogEmit = {
  (event: 'open-room', roomId: string): void
}
