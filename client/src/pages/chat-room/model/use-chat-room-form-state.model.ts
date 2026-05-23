import { NON_EMPTY_PATTERN, createValidationMessages } from 'global-shared'
import { reactive } from 'vue'

import { useI18n } from 'src/shared/lib'

import {
  CHAT_ROOM_NAME_MAX_LENGTH_PATTERN,
  CREATE_CHAT_ROOM_AVATAR_MAX_FILE_SIZE,
  CREATE_CHAT_ROOM_AVATAR_MAX_MB
} from '../config/constants'
import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import type { ChatRoomFormData, ChatRoomFormState } from '../config/types'

export const useChatRoomFormState = () => {
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const chatRoomFormData = reactive<ChatRoomFormData>({
    chatRoomName: undefined,
    chatAvatarFile: undefined,
    selectedMemberIds: []
  })
  const chatRoomFormState = reactive<ChatRoomFormState>({
    chatAvatarUploadValue: [],
    hasInitialChatAvatar: false,
    chatAvatarWasDeleted: false,
    isSavingChatRoom: false
  })
  const chatRoomFormValidationData = reactive({
    avatar: {
      value: [],
      rules: [
        {
          fileMaxSize: CREATE_CHAT_ROOM_AVATAR_MAX_FILE_SIZE,
          error: t(CHAT_ROOM_PAGE_I18N.chatImageInvalidSize)(CREATE_CHAT_ROOM_AVATAR_MAX_MB)
        }
      ]
    },
    chatName: {
      value: '',
      rules: [
        { pattern: NON_EMPTY_PATTERN, error: validationMessages.fieldIsRequired },
        { pattern: CHAT_ROOM_NAME_MAX_LENGTH_PATTERN, error: t(CHAT_ROOM_PAGE_I18N.chatNameTooLong) }
      ]
    },
    contactSearch: { value: '', rules: [] },
    members: { value: '', rules: [] }
  })

  const resetChatRoomFormData = () => {
    chatRoomFormData.selectedMemberIds = []
    chatRoomFormData.chatRoomName = undefined
  }

  const resetChatRoomFormState = () => {
    chatRoomFormValidationData.contactSearch.value = ''
  }

  return {
    chatRoomFormData,
    chatRoomFormState,
    chatRoomFormValidationData,
    resetChatRoomFormData,
    resetChatRoomFormState
  }
}
