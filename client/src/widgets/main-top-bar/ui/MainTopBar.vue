<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphIconExit, NmorphIcon } from '@nmorph/nmorph-ui-kit'
import { useTimeoutFn } from '@vueuse/core'
import { formatNickname } from 'global-shared'
import { computed, ref, watch } from 'vue'

import { useUser } from 'src/entities/user'
import { socketStatus } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'
import { AppProfileBasicData } from 'src/shared/ui'

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
      return { color: 'var(--nmorph-success-color)' as const, value: t(MAIN_TOP_BAR_I18N.online) }
    case 'reconnecting':
      return { color: 'var(--nmorph-warn-color)' as const, value: t(MAIN_TOP_BAR_I18N.reconnecting) }
    case 'offline':
      return { color: 'var(--nmorph-error-color)' as const, value: t(MAIN_TOP_BAR_I18N.offline) }
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
    <AppProfileBasicData
      class="main-top-bar__profile"
      :image-alt="user.nickname"
      :image-id="avatarId"
      :title="formatNickname(user.nickname)"
    >
      <template #description>
        <NmorphBadge v-if="socketTag" :value="socketTag.value" is-tag :color="socketTag.color" />
      </template>
    </AppProfileBasicData>
    <div class="main-top-bar__actions nmorph--shadow-inset">
      <NmorphButton @click="logout" :loading="isLogoutLoading">
        <template #icon>
          <NmorphIconExit class="main-top-bar__exit-btn" />
        </template>
      </NmorphButton>
    </div>
  </header>
</template>

<style lang="scss">
.main-top-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.main-top-bar__profile {
  flex: 1 1 auto;
  min-width: 0;
}

.main-top-bar__actions {
  margin-right: 8px;
  padding: 8px;
}
</style>
