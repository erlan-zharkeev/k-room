<script setup lang="ts">
import { NmorphEmojiPicker } from '@nmorph/nmorph-ui-kit'

import type { MessageReactionPickerEmits, MessageReactionPickerProps } from '../config/types'
import { useMessageReactionPicker } from '../model/use-message-reaction-picker.model'

const props = defineProps<MessageReactionPickerProps>()
const emit = defineEmits<MessageReactionPickerEmits>()
const { emojiPickerDataSource, emojiPickerI18n, emojiPickerLanguage, emojiPickerQuickList, selectMessageReaction } =
  useMessageReactionPicker(props, emit)
</script>

<template>
  <div class="message-reaction-picker" @click.stop>
    <NmorphEmojiPicker
      :data-source="emojiPickerDataSource"
      :i18n="emojiPickerI18n"
      :initial-expanded="false"
      :language="emojiPickerLanguage"
      :quick-list="emojiPickerQuickList"
      @select="selectMessageReaction"
    />
  </div>
</template>
