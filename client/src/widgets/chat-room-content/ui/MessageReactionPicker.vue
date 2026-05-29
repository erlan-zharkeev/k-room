<script setup lang="ts">
import { NmorphEmojiPicker } from '@nmorph/nmorph-ui-kit'

import { MESSAGE_CONTEXT_MENU_WIDTH } from '../config/constants'
import type { MessageReactionPickerEmits, MessageReactionPickerProps } from '../config/types'
import { useMessageReactionPicker } from '../model/use-message-reaction-picker.model'

const props = defineProps<MessageReactionPickerProps>()
const emit = defineEmits<MessageReactionPickerEmits>()
const { emojiPickerLocale, emojiPickerQuickList, selectMessageReaction } = useMessageReactionPicker(props, emit)
</script>

<template>
  <div class="message-reaction-picker" @click.stop>
    <NmorphEmojiPicker
      v-if="emojiPickerLocale"
      :data-source="emojiPickerLocale.data"
      :i18n="emojiPickerLocale.i18n"
      :initial-expanded="false"
      :language="emojiPickerLocale.language"
      :width="MESSAGE_CONTEXT_MENU_WIDTH"
      :quick-list="emojiPickerQuickList"
      hide-shadow
      @select="selectMessageReaction"
    />
  </div>
</template>

<style lang="scss">
.message-reaction-picker {
  width: 100%;
}
</style>
