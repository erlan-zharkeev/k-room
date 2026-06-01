import { useClipboard } from '@vueuse/core'
import type { Message } from 'global-shared'
import { computed, type Ref } from 'vue'

import { useAppToast, useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'

export const useMessageCopyText = (message: Readonly<Ref<Message>>) => {
  const { copy, isSupported: isClipboardSupported } = useClipboard()
  const { t } = useI18n()
  const toast = useAppToast()
  const canCopyMessageText = computed(() => Boolean(message.value.body.trim()) && isClipboardSupported.value)

  const copyMessageText = async () => {
    if (!canCopyMessageText.value) return

    await copy(message.value.body)
    toast.add({ content: t(CHAT_ROOM_CONTENT_I18N.messageTextCopied) })
  }

  return {
    canCopyMessageText,
    copyMessageText
  }
}
