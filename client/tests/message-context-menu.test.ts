import { MESSAGE_STATUS_VALUE, type ChatRoom, type Message } from 'global-shared'
import { describe, expect, it, beforeEach, vi } from 'vitest'

import {
  MESSAGE_CONTEXT_MENU_ACTION,
  MESSAGE_CONTEXT_MENU_TRIGGER
} from '../src/widgets/chat-room-content/config/constants'

const contextMenuMocks = vi.hoisted(() => ({
  canCopyMessageText: { value: true },
  canStartMessageEdit: vi.fn(() => true),
  canUpdatePinnedMessage: { value: true },
  copyMessageText: vi.fn(),
  isDeleteMessageDialogOpen: { value: false },
  isMessagePinned: { value: false },
  isTouchInput: { value: false },
  openDeleteMessageDialog: vi.fn(() => {
    contextMenuMocks.isDeleteMessageDialogOpen.value = true
  }),
  startMessageEdit: vi.fn(),
  startMessageReply: vi.fn(),
  togglePinnedMessage: vi.fn()
}))

vi.mock('@nmorph/nmorph-ui-kit', () => ({
  NmorphIconCopy: {},
  NmorphIconDelete: {},
  NmorphIconEdit: {},
  NmorphIconForwardFilled: {},
  NmorphIconPin: {},
  NmorphIconReplyFilled: {}
}))

vi.mock('../src/widgets/chat-room-content/ui/MessageReactionPicker.vue', () => ({
  default: {}
}))

vi.mock('src/shared/lib', () => ({
  useI18n: () => ({ t: () => 'label' }),
  useTouchInput: () => ({ isTouchInput: contextMenuMocks.isTouchInput })
}))

vi.mock('../src/widgets/chat-room-content/model/use-message-copy-text.model', () => ({
  useMessageCopyText: () => ({
    canCopyMessageText: contextMenuMocks.canCopyMessageText,
    copyMessageText: contextMenuMocks.copyMessageText
  })
}))

vi.mock('../src/widgets/chat-room-content/model/use-message-delete-dialog.model', () => ({
  useMessageDeleteDialog: () => ({
    isDeleteMessageDialogOpen: contextMenuMocks.isDeleteMessageDialogOpen,
    openDeleteMessageDialog: contextMenuMocks.openDeleteMessageDialog
  })
}))

vi.mock('../src/widgets/chat-room-content/model/use-message-draft-reference.model', () => ({
  useMessageDraftReference: () => ({
    startMessageReply: contextMenuMocks.startMessageReply
  })
}))

vi.mock('../src/widgets/chat-room-content/model/use-message-edit.model', () => ({
  useMessageEdit: () => ({
    canStartMessageEdit: contextMenuMocks.canStartMessageEdit,
    startMessageEdit: contextMenuMocks.startMessageEdit
  })
}))

vi.mock('../src/widgets/chat-room-content/model/use-message-pin.model', () => ({
  useMessagePin: () => ({
    canUpdatePinnedMessage: contextMenuMocks.canUpdatePinnedMessage,
    isMessagePinned: contextMenuMocks.isMessagePinned,
    togglePinnedMessage: contextMenuMocks.togglePinnedMessage
  })
}))

const { useMessageContextMenu } = await import('../src/widgets/chat-room-content/model/use-message-context-menu.model')
const { useMessageCopyTextContextMenuItem } = await import(
  '../src/widgets/chat-room-content/model/use-message-copy-text-context-menu-item.model'
)
const { useMessageDeleteContextMenuItem } = await import(
  '../src/widgets/chat-room-content/model/use-message-delete-context-menu-item.model'
)
const { useMessageEditContextMenuItem } = await import(
  '../src/widgets/chat-room-content/model/use-message-edit-context-menu-item.model'
)
const { useMessageForwardContextMenuItem } = await import(
  '../src/widgets/chat-room-content/model/use-message-forward-context-menu-item.model'
)
const { useMessagePinContextMenuItem } = await import(
  '../src/widgets/chat-room-content/model/use-message-pin-context-menu-item.model'
)
const { useMessageReplyContextMenuItem } = await import(
  '../src/widgets/chat-room-content/model/use-message-reply-context-menu-item.model'
)

const createMessage = (patch: Partial<Message> = {}): Message =>
  ({
    id: 'message-1',
    authorId: 'user-1',
    authorNickname: 'Tester',
    body: 'hello',
    createdAt: 1,
    images: [],
    reactions: [],
    isSelf: true,
    status: MESSAGE_STATUS_VALUE.DELIVERED,
    ...patch
  } as Message)

const createRoom = (patch: Partial<ChatRoom> = {}): ChatRoom =>
  ({
    id: 'room-1',
    users: ['user-1', 'user-2'],
    messages: ['message-1'],
    pinnedMessageId: null,
    ...patch
  } as ChatRoom)

describe('useMessageContextMenu', () => {
  beforeEach(() => {
    contextMenuMocks.canCopyMessageText.value = true
    contextMenuMocks.canStartMessageEdit.mockReturnValue(true)
    contextMenuMocks.canUpdatePinnedMessage.value = true
    contextMenuMocks.isDeleteMessageDialogOpen.value = false
    contextMenuMocks.isMessagePinned.value = false
    contextMenuMocks.isTouchInput.value = false
  })

  it('builds all message context menu options for editable message', () => {
    const model = useMessageContextMenu({ message: createMessage(), room: createRoom() })

    expect(model.messageContextMenuOptions.value.map(({ value }) => value)).toEqual([
      MESSAGE_CONTEXT_MENU_ACTION.REACTION_PICKER,
      MESSAGE_CONTEXT_MENU_ACTION.COPY_TEXT,
      MESSAGE_CONTEXT_MENU_ACTION.REPLY_MESSAGE,
      MESSAGE_CONTEXT_MENU_ACTION.FORWARD_MESSAGE,
      MESSAGE_CONTEXT_MENU_ACTION.EDIT_MESSAGE,
      MESSAGE_CONTEXT_MENU_ACTION.PIN_MESSAGE,
      MESSAGE_CONTEXT_MENU_ACTION.DELETE_MESSAGE
    ])
  })

  it('updates conditional option states', () => {
    contextMenuMocks.isMessagePinned.value = true

    const model = useMessageContextMenu({
      message: createMessage({ isSelf: false }),
      room: createRoom({ pinnedMessageId: 'message-1' })
    })
    const values = model.messageContextMenuOptions.value.map(({ value }) => value)

    expect(values).not.toContain(MESSAGE_CONTEXT_MENU_ACTION.EDIT_MESSAGE)
    expect(values).toContain(MESSAGE_CONTEXT_MENU_ACTION.UNPIN_MESSAGE)
  })

  it('uses long press trigger for touch input', () => {
    contextMenuMocks.isTouchInput.value = true

    const model = useMessageContextMenu({ message: createMessage(), room: createRoom() })

    expect(model.messageContextMenuTrigger.value).toBe(MESSAGE_CONTEXT_MENU_TRIGGER.LONG_PRESS)
  })

  it('routes selected context menu actions to item-specific models', async () => {
    const message = createMessage()
    const room = createRoom()
    const emit = vi.fn()
    const openForwardDialog = vi.fn()
    const openDeleteDialog = vi.fn()

    await useMessageCopyTextContextMenuItem({ message, room }, emit).selectMessageCopyTextContextMenuItem()
    useMessageReplyContextMenuItem({ message, room }, emit).selectMessageReplyContextMenuItem()
    useMessageForwardContextMenuItem(
      { message, room, openDialog: openForwardDialog },
      emit
    ).selectMessageForwardContextMenuItem()
    useMessageEditContextMenuItem({ message, room }, emit).selectMessageEditContextMenuItem()
    useMessagePinContextMenuItem({ message, room }, emit).selectMessagePinContextMenuItem()
    useMessageDeleteContextMenuItem(
      { message, room, openDialog: openDeleteDialog },
      emit
    ).selectMessageDeleteContextMenuItem()

    expect(contextMenuMocks.copyMessageText).toHaveBeenCalled()
    expect(contextMenuMocks.startMessageReply).toHaveBeenCalledWith(message, room.id)
    expect(openForwardDialog).toHaveBeenCalled()
    expect(contextMenuMocks.startMessageEdit).toHaveBeenCalledWith(message, room.id)
    expect(contextMenuMocks.togglePinnedMessage).toHaveBeenCalled()
    expect(openDeleteDialog).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('select')
  })
})
