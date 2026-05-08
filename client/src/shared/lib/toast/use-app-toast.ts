import { useNmorphNotification } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { TOAST_PLACEMENT } from 'src/shared/config'

import type { AppToastStackType, IAppToastInput } from './types'

const { notifications, notify, removeNotification } = useNmorphNotification()
const toasts = computed(() => notifications.value)

export const useAppToast = () => {
  return {
    toasts,

    add(message: IAppToastInput, stackType: AppToastStackType = 'system') {
      notify({
        ...message,
        placement: message.placement ?? TOAST_PLACEMENT[stackType],
        type: message.type ?? 'info'
      })
    },

    remove: removeNotification
  }
}
