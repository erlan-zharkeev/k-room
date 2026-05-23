import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import {
  CHAT_ROOM_GROUP_MEMBER_LIMIT,
  USER_CHAT_ROOM_LIMIT,
  type CreateRoomAckPayload,
  type EventCreateRoom,
  type EventUpdateChatRoom
} from 'global-shared'
import { computed, onBeforeUnmount, ref, toRef, type Ref, watch } from 'vue'

import { getRoomOtherUserIds, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useUser } from 'src/entities/user'
import { useSocketAction } from 'src/shared/api'
import {
  revokeObjectUrl,
  revokeObjectUrls,
  TOAST_I18N,
  useAppToast,
  useI18n,
  type ChatRoomRecord
} from 'src/shared/lib'
import type { AppUserPickerItem } from 'src/shared/ui'

import { CREATE_CHAT_ROOM_AVATAR_MAX_FILE_SIZE, CREATE_CHAT_ROOM_AVATAR_MAX_MB } from '../config/constants'
import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { ChatRoomFormDialogProps } from '../config/types'

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
  const { t } = useI18n()
  const toast = useAppToast()

  const chatRoomName = ref<string>()
  const chatAvatarUploadValue = ref<INmorphCustomFileData[]>([])
  const contactSearchQuery = ref('')
  const isSavingChatRoom = ref(false)
  const selectedMemberIds = ref<string[]>([])

  const editedChatRoom = computed(() => (roomId.value ? getById(roomId.value) : undefined))
  const isEditMode = computed(() => Boolean(roomId.value))
  const selectedOtherMemberIds = computed(() => getRoomOtherUserIds({ users: selectedMemberIds.value }, user.value.id))
  const isGroupChat = computed(() => isEditMode.value || selectedOtherMemberIds.value.length > 1)
  const isChatRoomNameEditable = computed(() => isGroupChat.value)
  const isChatRoomAvatarEditable = computed(() => isGroupChat.value)
  const normalizedContactSearchQuery = computed(() => contactSearchQuery.value.trim().toLowerCase())
  const contactPickerItems = computed<AppUserPickerItem[]>(() => {
    const itemsById = new Map<string, AppUserPickerItem>()

    acceptedContacts.value.forEach(({ id, nickname, online }) => {
      itemsById.set(id, { id, nickname, online })
    })

    if (editedChatRoom.value) {
      editedChatRoom.value.users.forEach((id) => {
        const userData = contactById.value.get(id) ?? knownUserById.value.get(id)

        if (userData) {
          itemsById.set(id, {
            id: userData.id,
            nickname: userData.nickname,
            online: userData.online
          })

          return
        }

        if (id !== user.value.id) return

        itemsById.set(id, {
          id: user.value.id,
          nickname: user.value.nickname
        })
      })
    }

    return [...itemsById.values()]
  })
  const filteredContactPickerItems = computed(() =>
    normalizedContactSearchQuery.value
      ? contactPickerItems.value.filter(({ nickname }) =>
          nickname.toLowerCase().includes(normalizedContactSearchQuery.value)
        )
      : contactPickerItems.value
  )
  const selectedPrivateContact = computed(() =>
    selectedOtherMemberIds.value.length === 1
      ? contactPickerItems.value.find(({ id }) => id === selectedOtherMemberIds.value[0])
      : undefined
  )
  const defaultGroupChatName = computed(() =>
    selectedOtherMemberIds.value
      .map((contactId) => contactPickerItems.value.find(({ id }) => id === contactId)?.nickname)
      .filter((nickname) => nickname)
      .join(', ')
  )
  const chatRoomNameInputValue = computed(() => {
    if (isEditMode.value) return chatRoomName.value ?? editedChatRoom.value?.chatName ?? ''

    return isGroupChat.value
      ? chatRoomName.value ?? defaultGroupChatName.value
      : selectedPrivateContact.value?.nickname ?? ''
  })
  const existingPrivateChatRoom = computed(() =>
    !isEditMode.value && selectedOtherMemberIds.value.length === 1
      ? getPersonalByContactId(selectedOtherMemberIds.value[0])
      : undefined
  )
  const lockedMemberIds = computed(() => (editedChatRoom.value ? [editedChatRoom.value.adminId] : [user.value.id]))
  const maxSelectedMemberIds = CHAT_ROOM_GROUP_MEMBER_LIMIT
  const canCreateMoreChats = computed(() => chatRooms.value.length < USER_CHAT_ROOM_LIMIT)
  const canSubmitChatRoom = computed(() => {
    const hasSelectedMembers = selectedOtherMemberIds.value.length > 0
    const hasValidMembersLimit = selectedMemberIds.value.length <= maxSelectedMemberIds
    const hasValidSelectedMembers = hasSelectedMembers && hasValidMembersLimit
    const hasChatName = Boolean(chatRoomNameInputValue.value.trim())
    const canOpenExistingPrivateChat = Boolean(existingPrivateChatRoom.value)
    const hasValidGroupChatName = !isGroupChat.value || hasChatName
    const canCreateNewChat = canCreateMoreChats.value && hasValidGroupChatName
    const canSubmitCreateChatRoom = hasValidSelectedMembers && (canOpenExistingPrivateChat || canCreateNewChat)
    const hasEditableChatName = Boolean(editedChatRoom.value) && hasChatName
    const canSubmitEditedChatRoom = hasEditableChatName && hasValidSelectedMembers

    return isEditMode.value ? canSubmitEditedChatRoom : canSubmitCreateChatRoom
  })
  const submitChatRoomButtonI18n = computed(() => {
    if (isEditMode.value) return CHAT_ROOM_PAGE_I18N.saveChat

    return existingPrivateChatRoom.value ? CHAT_ROOM_PAGE_I18N.openChat : CHAT_ROOM_PAGE_I18N.createChat
  })
  const dialogTitleI18n = computed(() =>
    isEditMode.value ? CHAT_ROOM_PAGE_I18N.editGroupTitle : CHAT_ROOM_PAGE_I18N.createChatTitle
  )
  const canCreateChat = computed(() => canSubmitChatRoom.value && !isEditMode.value && !existingPrivateChatRoom.value)
  const showNoContactSearchResults = computed(
    () => Boolean(normalizedContactSearchQuery.value) && filteredContactPickerItems.value.length === 0
  )

  const clearChatAvatarUploadValue = () => {
    revokeObjectUrls(chatAvatarUploadValue.value.map(({ previewUrl }) => previewUrl))
    chatAvatarUploadValue.value = []
  }

  const clearChatAvatarUpload = () => {
    clearChatAvatarUploadValue()
  }

  const resetChatRoomForm = () => {
    selectedMemberIds.value = []
    chatRoomName.value = undefined
    contactSearchQuery.value = ''
    clearChatAvatarUpload()
  }

  const initializeChatRoomForm = () => {
    resetChatRoomForm()

    if (!isEditMode.value) {
      selectedMemberIds.value = [user.value.id]

      return
    }

    const room = editedChatRoom.value

    if (!room) return

    selectedMemberIds.value = [...room.users]
    chatRoomName.value = room.chatName ?? ''
  }

  watch(isGroupChat, (isGroup) => {
    if (isEditMode.value || isGroup) return

    clearChatAvatarUpload()
  })

  watch([isChatRoomFormDialogOpen, roomId], ([isOpen]) => {
    if (!isOpen) return

    initializeChatRoomForm()
  })

  const updateChatRoomName = (value: string) => {
    if (!isChatRoomNameEditable.value) return

    chatRoomName.value = value
  }

  const showUnsupportedChatAvatarFormatError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(CHAT_ROOM_PAGE_I18N.chatImageInvalidFormat)
    })
  }

  const showChatAvatarInvalidSizeError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(CHAT_ROOM_PAGE_I18N.chatImageInvalidSize)(CREATE_CHAT_ROOM_AVATAR_MAX_MB)
    })
  }

  const updateChatAvatar = (files: INmorphCustomFileData[]) => {
    const file = files[files.length - 1]

    if (!file) {
      clearChatAvatarUpload()

      return
    }

    if (file.data.size > CREATE_CHAT_ROOM_AVATAR_MAX_FILE_SIZE) {
      revokeObjectUrl(file.previewUrl)
      clearChatAvatarUpload()
      showChatAvatarInvalidSizeError()

      return
    }

    chatAvatarUploadValue.value
      .filter(({ previewUrl }) => previewUrl !== file.previewUrl)
      .forEach(({ previewUrl }) => revokeObjectUrl(previewUrl))
    chatAvatarUploadValue.value = [file]
  }

  const closeChatRoomFormDialog = () => {
    if (isSavingChatRoom.value) return

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

  const buildChatAvatarFile = async () => {
    const file = chatAvatarUploadValue.value[0]?.data

    if (!file) return undefined

    try {
      return {
        src: file.name,
        name: file.name,
        fileBuffer: await file.arrayBuffer()
      }
    } catch (error) {
      void error

      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: t(CHAT_ROOM_PAGE_I18N.chatImageReadFailed)
      })

      return null
    }
  }

  const createChatRoom = async () => {
    if (!canCreateChat.value || isSavingChatRoom.value) return

    isSavingChatRoom.value = true

    const avatarFile = isGroupChat.value ? await buildChatAvatarFile() : undefined

    if (avatarFile === null) {
      isSavingChatRoom.value = false

      return
    }

    const payload: EventCreateRoom = {
      memberIds: selectedMemberIds.value,
      ...(isGroupChat.value ? { chatName: chatRoomNameInputValue.value.trim() } : {}),
      ...(avatarFile ? { avatarFile } : {})
    }

    const response = await emitSocketAction<EventCreateRoom, CreateRoomAckPayload>('create-chat-room', payload)

    isSavingChatRoom.value = false

    if (!response.ok || !response.payload?.roomId) return

    const { roomId } = response.payload

    closeChatRoomFormDialog()
    openChatRoom(roomId)
  }

  const updateChatRoom = async (room: ChatRoomRecord) => {
    if (!canSubmitChatRoom.value || isSavingChatRoom.value) return

    isSavingChatRoom.value = true

    const avatarFile = await buildChatAvatarFile()

    if (avatarFile === null) {
      isSavingChatRoom.value = false

      return
    }

    const payload: EventUpdateChatRoom = {
      roomId: room.id,
      memberIds: selectedMemberIds.value,
      chatName: chatRoomNameInputValue.value.trim(),
      ...(avatarFile ? { avatarFile } : {})
    }

    const response = await emitSocketAction<EventUpdateChatRoom>('update-chat-room', payload)

    isSavingChatRoom.value = false

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

  return {
    chatAvatarUploadValue,
    chatRoomNameInputValue,
    contactSearchQuery,
    isSavingChatRoom,
    selectedMemberIds,
    contactPickerItems,
    filteredContactPickerItems,
    lockedMemberIds,
    maxSelectedMemberIds,
    isChatRoomNameEditable,
    isChatRoomAvatarEditable,
    canSubmitChatRoom,
    submitChatRoomButtonI18n,
    dialogTitleI18n,
    showNoContactSearchResults,
    closeChatRoomFormDialog,
    updateChatRoomFormDialogOpen,
    updateChatRoomName,
    updateChatAvatar,
    showUnsupportedChatAvatarFormatError,
    submitChatRoom
  }
}
