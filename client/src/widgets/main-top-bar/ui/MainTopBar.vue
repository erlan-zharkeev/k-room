<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { Button } from 'primevue'
import { computed, ref, watch } from 'vue'

import { useUser } from 'src/entities/user'
import { socketStatus } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'
import { AppProfileBasicData, AppTag } from 'src/shared/ui'

import { MAIN_TOP_BAR_OFFLINE_STATUS_DELAY_MS } from '../config/constants'
import { MAIN_TOP_BAR_I18N } from '../config/i18n'
import { useLogout } from '../model/use-logout'

const { t } = useI18n()
const { user, avatarId } = useUser()
const { isLogoutLoading, logout } = useLogout()
const displayedSocketStatus = ref('')

const socketStatusValue = computed(() => {
  if (socketStatus.isConnected.value) return 'online'
  if (socketStatus.isReconnecting.value) return 'reconnecting'

  return 'offline'
})

const { start: startOfflineStatusTimer, stop: stopOfflineStatusTimer } = useTimeoutFn(
  () => {
    displayedSocketStatus.value = 'offline'
  },
  MAIN_TOP_BAR_OFFLINE_STATUS_DELAY_MS,
  { immediate: false }
)

const socketTag = computed(() => {
  switch (displayedSocketStatus.value) {
    case 'online':
      return { severity: 'success' as const, value: 'online' }
    case 'reconnecting':
      return { severity: 'warn' as const, value: 'reconnecting' }
    case 'offline':
      return { severity: 'danger' as const, value: 'offline' }
    default:
      return null
  }
})

watch(
  socketStatusValue,
  (status) => {
    stopOfflineStatusTimer()

    if (status !== 'offline') {
      displayedSocketStatus.value = status

      return
    }

    startOfflineStatusTimer()
  },
  { immediate: true }
)

</script>

<template>
  <header class="main-top-bar">
    <AppProfileBasicData :image-alt="user.username" :image-id="avatarId" :title="user.username">
      <template #description>
        <AppTag
          v-if="socketTag"
          :severity="socketTag.severity"
          :value="socketTag.value"
        />
      </template>
    </AppProfileBasicData>
    <div class="main-top-bar__actions">
      <Button :aria-label="t(MAIN_TOP_BAR_I18N.logout)" :pt="{
            root: { class: ['app-hoverless-btn'] },
          }" :loading="isLogoutLoading" size="large" text icon="pi pi-sign-out" @click="logout" />
    </div>
  </header>
</template>

<style lang="scss">
.main-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
