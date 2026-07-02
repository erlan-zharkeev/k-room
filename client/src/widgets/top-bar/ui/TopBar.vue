<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphButton, NmorphIconExit, NmorphIcon } from '@nmorph/nmorph-ui-kit'

import { useUser } from 'src/entities/user'
import { OnboardingGuideTarget } from 'src/features/onboarding-guide'
import { CallActivityPanel } from 'src/features/room-call-session'
import { AppProfileBasicData } from 'src/shared/ui'

import { useLogout } from '../model/use-logout.model'
import { useRoomCallActivityNavigation } from '../model/use-room-call-activity-navigation.model'
import { useTopBarGuide } from '../model/use-top-bar-guide.model'
import { useTopBarSocketStatus } from '../model/use-top-bar-socket-status.model'

const { user, avatarId } = useUser()
const { isLogoutLoading, logout } = useLogout()
const { openRoomCall } = useRoomCallActivityNavigation()
const { topBarGuidePosition } = useTopBarGuide()
const { socketTag } = useTopBarSocketStatus()
</script>

<template>
  <NmorphCard tag="header" class="top-bar" content-class="top-bar__content">
    <OnboardingGuideTarget class="top-bar__profile-guide-target" name="topBar" :position="topBarGuidePosition">
      <AppProfileBasicData :image-alt="user.nickname" :image-id="avatarId" :title="user.nickname" :name="user.nickname">
        <template #description>
          <NmorphBadge
            v-if="socketTag"
            :class="{ 'top-bar__socket-badge--blinking': socketTag.isBlinking }"
            :value="socketTag.value"
            type="tag"
            :color="socketTag.color"
            size="tiny"
          />
        </template>
      </AppProfileBasicData>
    </OnboardingGuideTarget>
    <div class="top-bar__content-right-side">
      <CallActivityPanel @open-room-call="openRoomCall" />
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

<style lang="scss" scoped>
.top-bar__socket-badge--blinking.nmorph-badge {
  animation: top-bar-socket-badge-blink 1.8s ease-in-out infinite;
}

.top-bar__profile-guide-target.nmorph-guide-step,
.top-bar__profile-guide-target.nmorph-tooltip {
  min-width: 0;
}

.top-bar__profile-guide-target > :deep(.nmorph-tooltip),
.top-bar__profile-guide-target > :deep(.nmorph-tooltip__content),
.top-bar__profile-guide-target > :deep(.nmorph-tooltip__content > .nmorph-tooltip__trigger),
.top-bar__profile-guide-target > :deep(.nmorph-tooltip > .nmorph-tooltip__content),
.top-bar__profile-guide-target > :deep(.nmorph-tooltip > .nmorph-tooltip__content > .nmorph-tooltip__trigger) {
  display: flex;
  min-width: 0;
}

@keyframes top-bar-socket-badge-blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}
</style>
