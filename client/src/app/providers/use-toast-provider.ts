import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { useAppToast } from 'src/shared/lib/toast'

export const useToastProvider = () => {
  const { settings } = useSettings()
  const { isAuthorized } = useUser()
  const { systemToasts: rawSystemToasts, messageToasts: rawMessageToasts } = useAppToast()

  const isToastVisible = computed(() => settings.value.showNotification || !isAuthorized.value)

  const systemToasts = computed(() => (isToastVisible.value ? rawSystemToasts.value : []))
  const messageToasts = computed(() => (isToastVisible.value ? rawMessageToasts.value : []))

  return { systemToasts, messageToasts }
}
