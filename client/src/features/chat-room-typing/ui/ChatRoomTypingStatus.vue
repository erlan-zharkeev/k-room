<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

import type { ChatRoomTypingStatusProps } from '../config/types'
import { useChatRoomTypingStatus } from '../model/use-chat-room-typing.model'

const props = defineProps<ChatRoomTypingStatusProps>()
const { typingText } = useChatRoomTypingStatus(props)
</script>

<template>
  <NmorphText v-if="typingText" as="small" color="accent" :truncate="props.truncate" variant="body-small">{{
    typingText
  }}</NmorphText>
  <slot v-else />
</template>
