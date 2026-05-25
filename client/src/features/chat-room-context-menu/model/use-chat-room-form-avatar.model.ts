import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'

import { useMedia } from 'src/entities/media-file'
import {
  revokeObjectUrl,
  revokeObjectUrls,
  TOAST_I18N,
  type ChatRoomRecord,
  useAppToast,
  useI18n
} from 'src/shared/lib'

import { CHAT_ROOM_CONTEXT_MENU_I18N } from '../config/i18n'
import type { ChatRoomFormAvatarParams } from '../config/types'

export const useChatRoomFormAvatar = ({
  chatRoomFormData,
  chatRoomFormState,
  isChatRoomFormDialogOpen,
  isEditMode,
  roomId
}: ChatRoomFormAvatarParams) => {
  const { get: getMedia } = useMedia()
  const { t } = useI18n()
  const toast = useAppToast()

  const clearChatAvatarUploadValue = () => {
    revokeObjectUrls(chatRoomFormState.chatAvatarUploadValue.map(({ previewUrl }) => previewUrl))
    chatRoomFormState.chatAvatarUploadValue = []
  }

  const clearChatAvatarUpload = () => {
    clearChatAvatarUploadValue()
    chatRoomFormData.chatAvatarFile = undefined
    chatRoomFormState.hasInitialChatAvatar = false
    chatRoomFormState.chatAvatarWasDeleted = false
  }

  const deleteChatAvatar = () => {
    clearChatAvatarUploadValue()
    chatRoomFormData.chatAvatarFile = undefined
    chatRoomFormState.chatAvatarWasDeleted = isEditMode.value && chatRoomFormState.hasInitialChatAvatar
  }

  const loadCurrentChatAvatar = async (room: ChatRoomRecord) => {
    if (!room.avatarId) return

    const record = await getMedia(room.avatarId)
    const blob = record?.blob
    const dialogWasClosed = !isChatRoomFormDialogOpen.value
    const roomWasChanged = roomId.value !== room.id
    const shouldSkipAvatarLoad = !blob || dialogWasClosed || roomWasChanged

    if (shouldSkipAvatarLoad) return
    if (chatRoomFormData.chatAvatarFile || chatRoomFormState.chatAvatarWasDeleted) return

    const file = new File([blob], room.avatarId, { type: blob.type })
    const previewUrl = URL.createObjectURL(blob)

    clearChatAvatarUploadValue()
    chatRoomFormState.chatAvatarUploadValue = [{ data: file, previewUrl }]
    chatRoomFormState.hasInitialChatAvatar = true
  }

  const showUnsupportedChatAvatarFormatError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(CHAT_ROOM_CONTEXT_MENU_I18N.chatImageInvalidFormat)
    })
  }

  const updateChatAvatar = (files: INmorphCustomFileData[]) => {
    const file = files[files.length - 1]

    if (!file) {
      deleteChatAvatar()

      return
    }

    chatRoomFormState.chatAvatarUploadValue
      .filter(({ previewUrl }) => previewUrl !== file.previewUrl)
      .forEach(({ previewUrl }) => revokeObjectUrl(previewUrl))
    chatRoomFormState.chatAvatarUploadValue = [file]
    chatRoomFormData.chatAvatarFile = file.data
    chatRoomFormState.chatAvatarWasDeleted = false
  }

  const buildChatAvatarFile = async () => {
    const file = chatRoomFormData.chatAvatarFile

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
        content: t(CHAT_ROOM_CONTEXT_MENU_I18N.chatImageReadFailed)
      })

      return null
    }
  }

  return {
    buildChatAvatarFile,
    clearChatAvatarUpload,
    loadCurrentChatAvatar,
    showUnsupportedChatAvatarFormatError,
    updateChatAvatar
  }
}
