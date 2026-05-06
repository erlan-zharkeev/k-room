import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { useAppToast } from 'src/shared/lib/toast'

export const useToastProvider = () => {
  const { settings } = useSettings()
  const { isAuthorized } = useUser()
  const { toasts: rawToasts } = useAppToast()

  const isToastVisible = computed(() => {
    const { enabled, general } = settings.value.notifications

    return (enabled && general.toast) || !isAuthorized.value
  })

  const toasts = computed(() => (isToastVisible.value ? rawToasts.value : []))

  return { toasts }
}
