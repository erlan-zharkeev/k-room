import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import type { ChatKind } from 'global-shared'
import type { Ref } from 'vue'

export interface ChatRoomContextMenuItem {
  id: string
  adminId: string
  chatKind: ChatKind
  unreadMessagesQuantity: number
  isPinned: boolean
  isMuted: boolean
}

export interface ChatRoomContextMenuProps {
  item: ChatRoomContextMenuItem
}

export interface ChatRoomContextMenuOption {
  label: string
  value:
    | 'mark-as-read'
    | 'pin-chat'
    | 'unpin-chat'
    | 'mute-chat'
    | 'unmute-chat'
    | 'edit-group'
    | 'delete-chat'
    | 'leave-group'
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
