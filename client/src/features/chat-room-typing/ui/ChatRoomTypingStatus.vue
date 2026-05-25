<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import type { ChatRoomTypingStatusProps } from '../config/types'
import { useChatRoomTypingStatus } from '../model/use-chat-room-typing.model'

const props = defineProps<ChatRoomTypingStatusProps>()
const { typingText } = useChatRoomTypingStatus(props)
</script>

<template>
  <AppText
    v-if="typingText"
    tag="small"
    color="accent"
    :truncate="props.truncate"
    :selectable="false"
    :text="typingText"
  />
  <slot v-else />
</template>
