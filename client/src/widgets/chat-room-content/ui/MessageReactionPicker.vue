<script setup lang="ts">
import { AppEmojiPicker } from 'src/shared/ui'

import type { MessageReactionPickerEmits, MessageReactionPickerProps } from '../config/types'
import { useMessageReactionPicker } from '../model/use-message-reaction-picker.model'

const props = defineProps<MessageReactionPickerProps>()
const emit = defineEmits<MessageReactionPickerEmits>()
const { expandLabel, language, selectMessageReaction } = useMessageReactionPicker(props, emit)
</script>

<template>
  <div class="message-reaction-picker" @click.stop>
    <AppEmojiPicker :expand-label="expandLabel" :language="language" @select="selectMessageReaction" />
  </div>
</template>
