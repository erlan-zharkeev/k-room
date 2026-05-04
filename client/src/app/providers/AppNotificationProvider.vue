<script setup lang="ts">
import { NmorphAlert } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { useAppToast } from 'src/shared/lib/notification'

const { notifications, remove } = useAppToast()
const { settings } = useSettings()
const { isAuthorized } = useUser()

const placements = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const
const visibleNotifications = computed(() => {
  if (!settings.value.showNotification && isAuthorized.value) return []
  return notifications.value
})

const notificationsByPlacement = computed(() =>
  placements.reduce<Record<string, typeof notifications.value>>((acc, placement) => {
    acc[placement] = visibleNotifications.value.filter((notification) => notification.placement === placement)
    return acc
  }, {})
)
</script>

<template>
  <div class="app-notification-provider">
    <div
      v-for="placement in placements"
      :key="placement"
      :class="['app-notification-provider__placement', `app-notification-provider__placement--${placement}`]"
    >
      <TransitionGroup name="app-notification">
        <div
          v-for="notification in notificationsByPlacement[placement]"
          :key="notification.id"
          class="app-notification-provider__notification"
          :style="{ width: notification.width }"
        >
          <NmorphAlert
            :id="notification.id"
            :type="notification.type"
            :title="notification.title"
            :content="notification.content"
            :fill="notification.fill"
            :closable="notification.closable"
            :bordered="notification.bordered"
            :show-icon="notification.showIcon"
            :html="notification.html"
            :close-icon-position="notification.closeIconPosition"
            @close="remove(notification.id)"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-notification-provider {
  pointer-events: none;
  position: fixed;
  z-index: 1000;
  inset: 0;
}

.app-notification-provider__placement {
  position: absolute;
  display: flex;
  flex-direction: column;
}

.app-notification-provider__placement--top-left {
  top: 0;
  left: 0;
  align-items: flex-start;
}

.app-notification-provider__placement--top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.app-notification-provider__placement--top-right {
  top: 0;
  right: 0;
  align-items: flex-end;
}

.app-notification-provider__placement--bottom-left {
  bottom: 0;
  left: 0;
  align-items: flex-start;
}

.app-notification-provider__placement--bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.app-notification-provider__placement--bottom-right {
  right: 0;
  bottom: 0;
  align-items: flex-end;
}

.app-notification-provider__notification {
  pointer-events: all;
  margin: 1rem;
}

.app-notification-enter-active,
.app-notification-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.app-notification-enter-from,
.app-notification-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}
</style>
