import { computed, toRef } from 'vue'

import type { MessageTextProps } from '../config/types'
import { buildMessageTextSegments } from '../lib/build-message-text-segments'

export const useMessageText = (props: MessageTextProps) => {
  const text = toRef(props, 'text')
  const segments = computed(() => buildMessageTextSegments(text.value))

  return {
    segments
  }
}
