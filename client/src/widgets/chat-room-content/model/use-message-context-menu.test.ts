import { type ChatRoom, type Message } from 'global-shared'
import { describe, expect, it, beforeEach, vi } from 'vitest'

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

vi.mock('../ui/MessageReactionPicker.vue', () => ({
  default: {}
}))

vi.mock('src/shared/lib', () => ({
  defineI18n: (namespace: string, source: Record<string, unknown>) =>
    Object.fromEntries(Object.keys(source).map((key) => [key, `${namespace}.${key}`])),
  i18nFormatter: () => '',
  useI18n: () => ({ t: () => 'label' }),
  useTouchInput: () => ({ isTouchInput: contextMenuMocks.isTouchInput })
}))

vi.mock('./use-message-copy-text.model', () => ({
  useMessageCopyText: () => ({
    canCopyMessageText: contextMenuMocks.canCopyMessageText,
    copyMessageText: contextMenuMocks.copyMessageText
  })
}))

vi.mock('./use-message-delete-dialog.model', () => ({
  useMessageDeleteDialog: () => ({
    isDeleteMessageDialogOpen: contextMenuMocks.isDeleteMessageDialogOpen,
    openDeleteMessageDialog: contextMenuMocks.openDeleteMessageDialog
  })
}))

vi.mock('./use-message-draft-reference.model', () => ({
  useMessageDraftReference: () => ({
    startMessageReply: contextMenuMocks.startMessageReply
  })
}))

vi.mock('./use-message-edit.model', () => ({
  useMessageEdit: () => ({
    canStartMessageEdit: contextMenuMocks.canStartMessageEdit,
    startMessageEdit: contextMenuMocks.startMessageEdit
  })
}))

vi.mock('./use-message-pin.model', () => ({
  useMessagePin: () => ({
    canUpdatePinnedMessage: contextMenuMocks.canUpdatePinnedMessage,
    isMessagePinned: contextMenuMocks.isMessagePinned,
    togglePinnedMessage: contextMenuMocks.togglePinnedMessage
  })
}))

const { useMessageContextMenu } = await import('./use-message-context-menu.model')
const { useMessageCopyTextContextMenuItem } = await import('./use-message-copy-text-context-menu-item.model')
const { useMessageDeleteContextMenuItem } = await import('./use-message-delete-context-menu-item.model')
const { useMessageEditContextMenuItem } = await import('./use-message-edit-context-menu-item.model')
const { useMessageForwardContextMenuItem } = await import('./use-message-forward-context-menu-item.model')
const { useMessagePinContextMenuItem } = await import('./use-message-pin-context-menu-item.model')
const { useMessageReplyContextMenuItem } = await import('./use-message-reply-context-menu-item.model')

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
    status: 'delivered',
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
      'reaction-picker',
      'copy-text',
      'reply-message',
      'forward-message',
      'edit-message',
      'pin-message',
      'delete-message'
    ])
  })

  it('updates conditional option states', () => {
    contextMenuMocks.isMessagePinned.value = true

    const model = useMessageContextMenu({
      message: createMessage({ isSelf: false }),
      room: createRoom({ pinnedMessageId: 'message-1' })
    })
    const values = model.messageContextMenuOptions.value.map(({ value }) => value)

    expect(values).not.toContain('edit-message')
    expect(values).toContain('unpin-message')
  })

  it('uses long press trigger for touch input', () => {
    contextMenuMocks.isTouchInput.value = true

    const model = useMessageContextMenu({ message: createMessage(), room: createRoom() })

    expect(model.messageContextMenuTrigger.value).toBe('longpress')
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
