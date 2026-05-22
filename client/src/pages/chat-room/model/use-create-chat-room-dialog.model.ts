import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { USER_CHAT_ROOM_LIMIT, type CreateRoomAckPayload, type EventCreateRoom } from 'global-shared'
import { computed, onBeforeUnmount, ref, type Ref, watch } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useSocketAction } from 'src/shared/api'
import { revokeObjectUrl, revokeObjectUrls, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import {
  CREATE_CHAT_ROOM_AVATAR_MAX_FILE_SIZE,
  CREATE_CHAT_ROOM_AVATAR_MAX_MB,
  CREATE_CHAT_ROOM_CONTACT_PICKER_LIMIT
} from '../config/constants'
import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'

export const useCreateChatRoomDialog = (
  isCreateChatDialogOpen: Ref<boolean>,
  openChatRoom: (roomId: string) => void
) => {
  const { chatRooms, getPersonalByContactId } = useChatRoom()
  const { acceptedContacts } = useContact()
  const { emitSocketAction } = useSocketAction()
  const { t } = useI18n()
  const toast = useAppToast()

  const createChatName = ref<string>()
  const chatAvatarUploadValue = ref<INmorphCustomFileData[]>([])
  const contactSearchQuery = ref('')
  const isCreatingChat = ref(false)
  const selectedContactIds = ref<string[]>([])

  const normalizedContactSearchQuery = computed(() => contactSearchQuery.value.trim().toLowerCase())
  const filteredAcceptedContacts = computed(() =>
    normalizedContactSearchQuery.value
      ? acceptedContacts.value.filter(({ nickname }) =>
          nickname.toLowerCase().includes(normalizedContactSearchQuery.value)
        )
      : acceptedContacts.value
  )
  const selectedPrivateContact = computed(() =>
    selectedContactIds.value.length === 1
      ? acceptedContacts.value.find(({ id }) => id === selectedContactIds.value[0])
      : undefined
  )
  const defaultGroupChatName = computed(() =>
    selectedContactIds.value
      .map((contactId) => acceptedContacts.value.find(({ id }) => id === contactId)?.nickname)
      .filter((nickname) => nickname)
      .join(', ')
  )

  const isGroupChat = computed(() => selectedContactIds.value.length > 1)
  const createChatNameInputValue = computed(() =>
    isGroupChat.value
      ? createChatName.value ?? defaultGroupChatName.value
      : selectedPrivateContact.value?.nickname ?? ''
  )
  const existingPrivateChatRoom = computed(() =>
    selectedContactIds.value.length === 1 ? getPersonalByContactId(selectedContactIds.value[0]) : undefined
  )
  const canCreateMoreChats = computed(() => chatRooms.value.length < USER_CHAT_ROOM_LIMIT)
  const canSubmitChat = computed(
    () =>
      selectedContactIds.value.length > 0 &&
      selectedContactIds.value.length <= CREATE_CHAT_ROOM_CONTACT_PICKER_LIMIT &&
      (Boolean(existingPrivateChatRoom.value) ||
        (canCreateMoreChats.value && (!isGroupChat.value || Boolean(createChatNameInputValue.value.trim()))))
  )
  const submitChatButtonI18n = computed(() =>
    existingPrivateChatRoom.value ? CHAT_ROOM_PAGE_I18N.openChat : CHAT_ROOM_PAGE_I18N.createChat
  )
  const canCreateChat = computed(
    () =>
      canSubmitChat.value &&
      !existingPrivateChatRoom.value &&
      (!isGroupChat.value || Boolean(createChatNameInputValue.value.trim()))
  )
  const showNoContactSearchResults = computed(
    () => Boolean(normalizedContactSearchQuery.value) && filteredAcceptedContacts.value.length === 0
  )

  const clearChatAvatarUploadValue = () => {
    revokeObjectUrls(chatAvatarUploadValue.value.map(({ previewUrl }) => previewUrl))
    chatAvatarUploadValue.value = []
  }

  const clearChatAvatarUpload = () => {
    clearChatAvatarUploadValue()
  }

  const openCreateChatDialog = () => {
    isCreateChatDialogOpen.value = true
  }

  watch(isGroupChat, (isGroup) => {
    if (isGroup) return

    clearChatAvatarUpload()
  })

  const updateCreateChatName = (value: string) => {
    if (!isGroupChat.value) return

    createChatName.value = value
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

  const showCreateChatFailedError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(CHAT_ROOM_PAGE_I18N.createChatFailed)
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

  const closeCreateChatDialog = () => {
    if (isCreatingChat.value) return

    isCreateChatDialogOpen.value = false
    selectedContactIds.value = []
    createChatName.value = undefined
    contactSearchQuery.value = ''
    clearChatAvatarUpload()
  }

  const updateCreateChatDialogOpen = (isOpen: boolean) => {
    if (isOpen) {
      openCreateChatDialog()

      return
    }

    closeCreateChatDialog()
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
    if (!canCreateChat.value || isCreatingChat.value) return

    isCreatingChat.value = true

    const avatarFile = isGroupChat.value ? await buildChatAvatarFile() : undefined

    if (avatarFile === null) {
      isCreatingChat.value = false

      return
    }

    const payload: EventCreateRoom = {
      contactIds: selectedContactIds.value,
      ...(isGroupChat.value ? { chatName: createChatNameInputValue.value.trim() } : {}),
      ...(avatarFile ? { avatarFile } : {})
    }

    const response = await emitSocketAction<EventCreateRoom, CreateRoomAckPayload>('create-chat-room', payload)

    isCreatingChat.value = false

    if (!response.ok || !response.payload?.roomId) {
      showCreateChatFailedError()

      return
    }

    const { roomId } = response.payload

    closeCreateChatDialog()
    openChatRoom(roomId)
  }

  const submitChat = async () => {
    const roomId = existingPrivateChatRoom.value?.id

    if (roomId) {
      closeCreateChatDialog()
      openChatRoom(roomId)

      return
    }

    await createChatRoom()
  }

  onBeforeUnmount(clearChatAvatarUpload)

  return {
    chatAvatarUploadValue,
    createChatNameInputValue,
    contactSearchQuery,
    isCreateChatDialogOpen,
    isCreatingChat,
    selectedContactIds,
    acceptedContacts,
    filteredAcceptedContacts,
    isGroupChat,
    canSubmitChat,
    submitChatButtonI18n,
    showNoContactSearchResults,
    closeCreateChatDialog,
    updateCreateChatDialogOpen,
    updateCreateChatName,
    updateChatAvatar,
    showUnsupportedChatAvatarFormatError,
    submitChat
  }
}
