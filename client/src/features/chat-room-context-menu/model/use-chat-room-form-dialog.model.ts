import {
  ROOM_PARTICIPANT_LIMIT,
  USER_CHAT_ROOM_LIMIT,
  type ChatRoom,
  type EventCreateRoom,
  type EventUpdateChatRoom
} from 'global-shared'
import { computed, onBeforeUnmount, toRef, toRefs, type Ref, watch } from 'vue'

import { getRoomOtherUserIds, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useUser } from 'src/entities/user'
import { useSocketAction } from 'src/shared/api'
import type { AppProfilePickerItem } from 'src/shared/ui'

import { CHAT_ROOM_NAME_MAX_LENGTH_PATTERN } from '../config/constants'
import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomFormDialogProps } from '../config/types'

import { useChatRoomFormAvatar } from './use-chat-room-form-avatar.model'
import { useChatRoomFormState } from './use-chat-room-form-state.model'

export const useChatRoomFormDialog = (
  props: ChatRoomFormDialogProps,
  isChatRoomFormDialogOpen: Ref<boolean>,
  openChatRoom: (roomId: string) => void
) => {
  const roomId = toRef(props, 'roomId')
  const { chatRooms, getById, getPersonalByContactId } = useChatRoom()
  const { acceptedContacts, contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { user } = useUser()
  const { emitSocketAction } = useSocketAction()
  const {
    chatRoomFormData,
    chatRoomFormState,
    chatRoomFormValidationData,
    resetChatRoomFormData,
    resetChatRoomFormState
  } = useChatRoomFormState()

  const editedChatRoom = computed(() => (roomId.value ? getById(roomId.value) : undefined))
  const isEditMode = computed(() => Boolean(roomId.value))
  const {
    buildChatAvatarFile,
    clearChatAvatarUpload,
    loadCurrentChatAvatar,
    showUnsupportedChatAvatarFormatError,
    updateChatAvatar
  } = useChatRoomFormAvatar({
    chatRoomFormData,
    chatRoomFormState,
    isChatRoomFormDialogOpen,
    isEditMode,
    roomId
  })
  const selectedOtherMemberIds = computed(() =>
    getRoomOtherUserIds({ users: chatRoomFormData.selectedMemberIds }, user.value.id)
  )
  const isGroupChat = computed(() => isEditMode.value || selectedOtherMemberIds.value.length > 1)
  const isChatRoomNameEditable = computed(() => isGroupChat.value)
  const isChatRoomAvatarEditable = computed(() => isGroupChat.value)
  const normalizedContactSearchQuery = computed(() =>
    chatRoomFormValidationData.contactSearch.value.trim().toLowerCase()
  )
  const contactPickerItems = computed<AppProfilePickerItem[]>(() => {
    const itemsById = new Map<string, AppProfilePickerItem>()

    acceptedContacts.value.forEach(({ avatarId, id, nickname, online }) => {
      itemsById.set(id, { imageId: avatarId, id, title: nickname, online })
    })

    if (editedChatRoom.value) {
      editedChatRoom.value.users.forEach((id) => {
        const userData = contactById.value.get(id) ?? knownUserById.value.get(id)

        if (userData) {
          itemsById.set(id, {
            imageId: userData.avatarId,
            id: userData.id,
            title: userData.nickname,
            online: userData.online
          })

          return
        }

        if (id !== user.value.id) return

        itemsById.set(id, {
          imageId: user.value.avatarId,
          id: user.value.id,
          title: user.value.nickname
        })
      })
    }

    return [...itemsById.values()]
  })
  const filteredContactPickerItems = computed(() =>
    normalizedContactSearchQuery.value
      ? contactPickerItems.value.filter(({ title }) => title.toLowerCase().includes(normalizedContactSearchQuery.value))
      : contactPickerItems.value
  )
  const selectedPrivateContact = computed(() =>
    selectedOtherMemberIds.value.length === 1
      ? contactPickerItems.value.find(({ id }) => id === selectedOtherMemberIds.value[0])
      : undefined
  )
  const defaultGroupChatName = computed(() =>
    selectedOtherMemberIds.value
      .map((contactId) => contactPickerItems.value.find(({ id }) => id === contactId)?.title)
      .filter((title) => title)
      .join(', ')
  )
  const resolvedChatRoomName = computed(() => {
    if (isEditMode.value) return chatRoomFormData.chatRoomName ?? editedChatRoom.value?.chatName ?? ''

    return isGroupChat.value
      ? chatRoomFormData.chatRoomName ?? defaultGroupChatName.value
      : selectedPrivateContact.value?.title ?? ''
  })
  const chatRoomNameInputValue = computed(() => chatRoomFormValidationData.chatName.value)
  const existingPrivateChatRoom = computed(() =>
    !isEditMode.value && selectedOtherMemberIds.value.length === 1
      ? getPersonalByContactId(selectedOtherMemberIds.value[0])
      : undefined
  )
  const lockedMemberIds = computed(() => (editedChatRoom.value ? [editedChatRoom.value.adminId] : [user.value.id]))
  const canCreateMoreChats = computed(() => chatRooms.value.length < USER_CHAT_ROOM_LIMIT)
  const canSubmitChatRoom = computed(() => {
    const hasSelectedMembers = selectedOtherMemberIds.value.length > 0
    const hasValidMembersLimit = chatRoomFormData.selectedMemberIds.length <= ROOM_PARTICIPANT_LIMIT
    const hasValidSelectedMembers = hasSelectedMembers && hasValidMembersLimit
    const hasChatName = Boolean(chatRoomNameInputValue.value.trim())
    const hasValidChatNameLength = CHAT_ROOM_NAME_MAX_LENGTH_PATTERN.test(chatRoomNameInputValue.value)
    const canOpenExistingPrivateChat = Boolean(existingPrivateChatRoom.value)
    const hasValidGroupChatName = !isGroupChat.value || (hasChatName && hasValidChatNameLength)
    const canCreateNewChat = canCreateMoreChats.value && hasValidGroupChatName
    const canSubmitCreateChatRoom = hasValidSelectedMembers && (canOpenExistingPrivateChat || canCreateNewChat)
    const hasEditableChatName = Boolean(editedChatRoom.value) && hasChatName && hasValidChatNameLength
    const canSubmitEditedChatRoom = hasEditableChatName && hasValidSelectedMembers

    return isEditMode.value ? canSubmitEditedChatRoom : canSubmitCreateChatRoom
  })
  const submitChatRoomButtonI18n = computed(() => {
    if (isEditMode.value) return CHAT_ROOM_CONTEXT_MENU_I18N.saveChat

    return existingPrivateChatRoom.value ? CHAT_ROOM_CONTEXT_MENU_I18N.openChat : CHAT_ROOM_CONTEXT_MENU_I18N.createChat
  })
  const dialogTitleI18n = computed(() =>
    isEditMode.value ? CHAT_ROOM_CONTEXT_MENU_I18N.editGroupTitle : CHAT_ROOM_CONTEXT_MENU_I18N.createChatTitle
  )
  const canCreateChat = computed(() => canSubmitChatRoom.value && !isEditMode.value && !existingPrivateChatRoom.value)
  const showNoContactSearchResults = computed(
    () => Boolean(normalizedContactSearchQuery.value) && filteredContactPickerItems.value.length === 0
  )

  const syncChatRoomNameInputValue = () => {
    chatRoomFormValidationData.chatName.value = resolvedChatRoomName.value
  }

  const resetChatRoomForm = () => {
    resetChatRoomFormData()
    resetChatRoomFormState()
    clearChatAvatarUpload()
    syncChatRoomNameInputValue()
  }

  const initializeChatRoomForm = async () => {
    resetChatRoomForm()

    if (!isEditMode.value) {
      chatRoomFormData.selectedMemberIds = [user.value.id]
      syncChatRoomNameInputValue()

      return
    }

    const room = editedChatRoom.value

    if (!room) return

    chatRoomFormData.selectedMemberIds = [...room.users]
    chatRoomFormData.chatRoomName = room.chatName ?? ''
    syncChatRoomNameInputValue()
    await loadCurrentChatAvatar(room)
  }

  watch(isGroupChat, (isGroup) => {
    if (isEditMode.value || isGroup) return

    clearChatAvatarUpload()
  })

  watch([isChatRoomFormDialogOpen, roomId], ([isOpen]) => {
    if (!isOpen) return

    void initializeChatRoomForm()
  })

  const updateChatRoomName = (value: string) => {
    if (!isChatRoomNameEditable.value) return

    chatRoomFormData.chatRoomName = value
  }

  const updateSelectedMemberIds = (memberIds: string[]) => {
    chatRoomFormData.selectedMemberIds = memberIds

    if (chatRoomFormData.chatRoomName !== undefined) return

    syncChatRoomNameInputValue()
  }

  const closeChatRoomFormDialog = () => {
    if (chatRoomFormState.isSavingChatRoom) return

    isChatRoomFormDialogOpen.value = false
    resetChatRoomForm()
  }

  const updateChatRoomFormDialogOpen = (isOpen: boolean) => {
    if (isOpen) {
      isChatRoomFormDialogOpen.value = true

      return
    }

    closeChatRoomFormDialog()
  }

  const createChatRoom = async () => {
    if (!canCreateChat.value || chatRoomFormState.isSavingChatRoom) return

    chatRoomFormState.isSavingChatRoom = true

    const avatarFile = isGroupChat.value ? await buildChatAvatarFile() : undefined

    if (avatarFile === null) {
      chatRoomFormState.isSavingChatRoom = false

      return
    }

    const payload: EventCreateRoom = {
      memberIds: chatRoomFormData.selectedMemberIds,
      ...(isGroupChat.value ? { chatName: chatRoomNameInputValue.value.trim() } : {}),
      ...(avatarFile ? { avatarFile } : {})
    }

    const response = await emitSocketAction('create-chat-room', payload)

    chatRoomFormState.isSavingChatRoom = false

    if (!response.ok) return

    const { roomId } = response.payload

    closeChatRoomFormDialog()
    openChatRoom(roomId)
  }

  const updateChatRoom = async (room: ChatRoom) => {
    if (!canSubmitChatRoom.value || chatRoomFormState.isSavingChatRoom) return

    chatRoomFormState.isSavingChatRoom = true

    const avatarFile = await buildChatAvatarFile()

    if (avatarFile === null) {
      chatRoomFormState.isSavingChatRoom = false

      return
    }

    const payload: EventUpdateChatRoom = {
      roomId: room.id,
      memberIds: chatRoomFormData.selectedMemberIds,
      chatName: chatRoomNameInputValue.value.trim(),
      ...(chatRoomFormState.chatAvatarWasDeleted ? { avatarFile: null } : {}),
      ...(avatarFile ? { avatarFile } : {})
    }

    const response = await emitSocketAction('update-chat-room', payload)

    chatRoomFormState.isSavingChatRoom = false

    if (!response.ok) return

    closeChatRoomFormDialog()
  }

  const submitChatRoom = async () => {
    const room = editedChatRoom.value
    const existingPrivateChatRoomId = existingPrivateChatRoom.value?.id

    if (room) {
      await updateChatRoom(room)

      return
    }

    if (existingPrivateChatRoomId) {
      closeChatRoomFormDialog()
      openChatRoom(existingPrivateChatRoomId)

      return
    }

    await createChatRoom()
  }

  onBeforeUnmount(clearChatAvatarUpload)

  const { selectedMemberIds } = toRefs(chatRoomFormData)
  const { chatAvatarUploadValue, isSavingChatRoom } = toRefs(chatRoomFormState)

  return {
    chatRoomFormValidationData,
    chatAvatarUploadValue,
    chatRoomNameInputValue,
    isSavingChatRoom,
    selectedMemberIds,
    contactPickerItems,
    filteredContactPickerItems,
    lockedMemberIds,
    maxSelectedMemberIds: ROOM_PARTICIPANT_LIMIT,
    isChatRoomNameEditable,
    isChatRoomAvatarEditable,
    canSubmitChatRoom,
    submitChatRoomButtonI18n,
    dialogTitleI18n,
    showNoContactSearchResults,
    closeChatRoomFormDialog,
    updateChatRoomFormDialogOpen,
    updateChatRoomName,
    updateSelectedMemberIds,
    updateChatAvatar,
    showUnsupportedChatAvatarFormatError,
    submitChatRoom
  }
}
