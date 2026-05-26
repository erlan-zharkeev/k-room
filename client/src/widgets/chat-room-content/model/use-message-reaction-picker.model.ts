import { toRef } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageReactionPickerEmit, MessageReactionPickerProps } from '../config/types'

import { useMessageReaction } from './use-message-reaction.model'

export const useMessageReactionPicker = (props: MessageReactionPickerProps, emit: MessageReactionPickerEmit) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { t } = useI18n()
  const { settings } = useSettings()
  const { toggleMessageReaction } = useMessageReaction(message, room)

  const selectMessageReaction = (glyphKey: string) => {
    toggleMessageReaction(glyphKey)
    emit('select')
  }

  return {
    expandLabel: t(CHAT_ROOM_CONTENT_I18N.selectEmoji),
    language: settings.value.localization.language,
    selectMessageReaction
  }
}
