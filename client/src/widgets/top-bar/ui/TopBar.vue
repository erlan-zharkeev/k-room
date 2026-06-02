<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphButton, NmorphIconExit, NmorphIcon } from '@nmorph/nmorph-ui-kit'

import { useUser } from 'src/entities/user'
import { AppProfileBasicData } from 'src/shared/ui'

import { useLogout } from '../model/use-logout.model'
import { useTopBarSocketStatus } from '../model/use-top-bar-socket-status.model'

import CallStatus from './CallStatus.vue'

const { user, avatarId, displayedNickname } = useUser()
const { isLogoutLoading, logout } = useLogout()
const { socketTag } = useTopBarSocketStatus()
</script>

<template>
  <NmorphCard tag="header" class="top-bar" content-class="top-bar__content">
    <AppProfileBasicData
      :image-alt="user.nickname"
      :image-id="avatarId"
      :title="displayedNickname"
      :name="user.nickname"
    >
      <template #description>
        <NmorphBadge v-if="socketTag" :value="socketTag.value" is-tag :color="socketTag.color" size="tiny" />
      </template>
    </AppProfileBasicData>
    <div class="top-bar__content-right-side">
      <CallStatus />
      <NmorphCard shadow-type="inset" :fill="false">
        <NmorphButton @click="logout" :loading="isLogoutLoading" shape="square">
          <NmorphIcon width="16px" height="16px">
            <NmorphIconExit />
          </NmorphIcon>
        </NmorphButton>
      </NmorphCard>
    </div>
  </NmorphCard>
</template>

<style lang="scss">
.top-bar__content {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.top-bar__content-right-side {
  display: flex;
  gap: 16px;
}
</style>
