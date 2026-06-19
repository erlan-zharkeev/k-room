import { type Message } from 'global-shared'
import { computed, type Ref } from 'vue'

import { MESSAGE_STATUS_DOT_COUNT_BY_STATUS, MESSAGE_STATUS_DOT_TONE_BY_STATUS } from '../config/constants'

export const useMessageStatusDots = (message: Ref<Message>) => {
  const status = computed(() => message.value.status ?? 'none')
  const dotCount = computed(() => MESSAGE_STATUS_DOT_COUNT_BY_STATUS[status.value])
  const tone = computed(() => MESSAGE_STATUS_DOT_TONE_BY_STATUS[status.value])
  const isBlinking = computed(() => status.value === 'sending')
  const isVisible = computed(() => Boolean(message.value.isSelf) && dotCount.value > 0)

  return {
    dotCount,
    isBlinking,
    isVisible,
    tone
  }
}
