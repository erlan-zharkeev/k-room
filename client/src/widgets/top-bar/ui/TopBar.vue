<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphIconExit, NmorphIcon } from '@nmorph/nmorph-ui-kit'
import { useTimeoutFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import { useUser } from 'src/entities/user'
import { socketStatus } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'
import { AppProfileBasicData } from 'src/shared/ui'

import { TOP_BAR_OFFLINE_STATUS_DELAY_MS } from '../config/constants'
import { TOP_BAR_I18N } from '../config/i18n'
import { useLogout } from '../model/use-logout.model'

const { t } = useI18n()
const { user, avatarId, displayedNickname } = useUser()
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
  TOP_BAR_OFFLINE_STATUS_DELAY_MS,
  { immediate: false }
)

const socketTag = computed(() => {
  switch (displayedSocketStatus.value) {
    case 'online':
      return { color: 'var(--nmorph-success-color)' as const, value: t(TOP_BAR_I18N.online) }
    case 'reconnecting':
      return { color: 'var(--nmorph-warn-color)' as const, value: t(TOP_BAR_I18N.reconnecting) }
    case 'offline':
      return { color: 'var(--nmorph-error-color)' as const, value: t(TOP_BAR_I18N.offline) }
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
  <header class="top-bar">
    <AppProfileBasicData
      class="top-bar__profile"
      :image-alt="user.nickname"
      :image-id="avatarId"
      :title="displayedNickname"
      :name="user.nickname"
    >
      <template #description>
        <NmorphBadge v-if="socketTag" :value="socketTag.value" is-tag :color="socketTag.color" size="tiny" />
      </template>
    </AppProfileBasicData>
    <div class="top-bar__actions nmorph--shadow-inset">
      <NmorphButton @click="logout" :loading="isLogoutLoading">
        <NmorphIcon width="18px">
          <NmorphIconExit class="top-bar__exit-btn" />
        </NmorphIcon>
      </NmorphButton>
    </div>
  </header>
</template>

<style lang="scss">
.top-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.top-bar__profile {
  flex: 1 1 auto;
  min-width: 0;
}

.top-bar__actions {
  margin-right: 8px;
  padding: 8px;
}
</style>
