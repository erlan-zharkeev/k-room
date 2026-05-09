import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { TOAST_LIFE_MS, TOAST_PLACEMENT } from 'src/shared/config'

import type { AppToastStackType, AppToastInputType } from './types'

const { notifications, notify, removeNotification } = useNmorphNotification()
const toasts = computed(() => notifications.value)

export const useAppToast = () => {
  return {
    toasts,

    add(message: AppToastInputType, stackType: AppToastStackType = 'system') {
      const type = message.type ?? 'info'

      notify({
        ...message,
        duration: message.duration ?? TOAST_LIFE_MS[type],
        placement: message.placement ?? TOAST_PLACEMENT[stackType],
        type
      })
    },

    remove: removeNotification
  }
}
