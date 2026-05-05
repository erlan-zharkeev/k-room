import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { useAppToast } from 'src/shared/lib/notification'

export const useNotificationProvider = () => {
  const { settings } = useSettings()
  const { isAuthorized } = useUser()
  const { systemToasts: rawSystemToasts, messageToasts: rawMessageToasts } = useAppToast()

  const isNotificationVisible = computed(() => settings.value.showNotification || !isAuthorized.value)

  const systemToasts = computed(() => (isNotificationVisible.value ? rawSystemToasts.value : []))
  const messageToasts = computed(() => (isNotificationVisible.value ? rawMessageToasts.value : []))

  return { systemToasts, messageToasts }
}
