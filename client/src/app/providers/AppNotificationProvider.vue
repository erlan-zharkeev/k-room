<script setup lang="ts">
import { NmorphNotificationProvider } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { useAppToast } from 'src/shared/lib/notification'

const { notifications } = useAppToast()
const { settings } = useSettings()
const { isAuthorized } = useUser()

const visibleNotifications = computed(() => {
  if (!settings.value.showNotification && isAuthorized.value) return []
  return notifications.value
})

const systemNotifications = computed(() =>
  visibleNotifications.value.filter((notification) => notification.placement === 'top-center')
)

const messageNotifications = computed(() =>
  visibleNotifications.value.filter((notification) => notification.placement === 'top-right')
)
</script>

<template>
  <NmorphNotificationProvider
    :notifications="systemNotifications"
    placement="top-center"
  />
  <NmorphNotificationProvider
    :notifications="messageNotifications"
    placement="top-right"
  />
</template>
