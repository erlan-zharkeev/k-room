<script setup lang="ts">
import { toRef } from 'vue'

import type { MessageStatusDotsProps } from '../config/types'
import { useMessageStatusDots } from '../model/use-message-status-dots.model'

const props = defineProps<MessageStatusDotsProps>()
const message = toRef(props, 'message')
const { dotCount, isBlinking, isVisible, tone } = useMessageStatusDots(message)
</script>

<template>
  <span
    v-if="isVisible"
    class="message-status-dots"
    :class="[`message-status-dots--${tone}`, isBlinking && 'message-status-dots--blinking']"
  >
    <span v-for="dotIndex in dotCount" :key="dotIndex" class="message-status-dots__dot" />
  </span>
</template>

<style lang="scss">
.message-status-dots {
  display: inline-flex;
  gap: 2px;
  align-items: center;
}

.message-status-dots__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.message-status-dots--text .message-status-dots__dot {
  background: var(--nmorph-text-color);
}

.message-status-dots--accent .message-status-dots__dot {
  background: var(--nmorph-accent-color);
}

.message-status-dots--error .message-status-dots__dot {
  background: var(--nmorph-error-text-color);
}

.message-status-dots--blinking .message-status-dots__dot {
  animation: message-status-dots-blink 1.8s ease-in-out infinite;
}

@keyframes message-status-dots-blink {
  50% {
    opacity: 0.35;
  }
}
</style>
