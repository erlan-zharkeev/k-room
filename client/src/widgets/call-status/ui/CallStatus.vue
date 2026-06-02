<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphIconClose,
  NmorphIcon,
  NmorphIconPhone,
  NmorphIconVideoCamera
} from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CALL_STATUS_I18N } from '../config/constants'
import { useCallStatus } from '../model/use-call-status.model'

const {
  callStatusItem,
  isCallStatusActionLoading,
  acceptIncomingAudioRoomCall,
  acceptIncomingVideoRoomCall,
  leaveRoomCall,
  openRoomCall
} = useCallStatus()
</script>

<template>
  <NmorphCard
    v-if="callStatusItem"
    tag="section"
    shadow-type="inset"
    :fill="false"
    class="call-status"
    :class="{ 'call-status--openable': callStatusItem.canOpen }"
    content-class="call-status__content"
    :role="callStatusItem.canOpen && 'button'"
    :tabindex="callStatusItem.canOpen && 0"
    :aria-label="callStatusItem.canOpen && $t(CALL_STATUS_I18N.openRoomCall)"
    :style="{ '--call-status-dot-color': callStatusItem.dotColor }"
    @click="openRoomCall"
    @keydown.enter.prevent="openRoomCall"
    @keydown.space.prevent="openRoomCall"
  >
    <span class="call-status__dot" />
    <AppText
      class="call-status__text"
      tag="small"
      truncate
      :selectable="false"
      :text="callStatusItem.text"
    />
    <div v-if="callStatusItem.canAccept || callStatusItem.canLeave" class="call-status__actions" @click.stop>
      <NmorphButton
        v-if="callStatusItem.canAccept"
        shape="square"
        style-type="transparent"
        :aria-label="$t(CALL_STATUS_I18N.acceptAudioRoomCall)"
        :title="$t(CALL_STATUS_I18N.acceptAudioRoomCall)"
        :loading="isCallStatusActionLoading"
        :disabled="isCallStatusActionLoading"
        @click="acceptIncomingAudioRoomCall"
      >
        <NmorphIcon width="16px" height="16px">
          <NmorphIconPhone />
        </NmorphIcon>
      </NmorphButton>
      <NmorphButton
        v-if="callStatusItem.canAccept"
        shape="square"
        style-type="transparent"
        :aria-label="$t(CALL_STATUS_I18N.acceptVideoRoomCall)"
        :title="$t(CALL_STATUS_I18N.acceptVideoRoomCall)"
        :loading="isCallStatusActionLoading"
        :disabled="isCallStatusActionLoading"
        @click="acceptIncomingVideoRoomCall"
      >
        <NmorphIcon width="16px" height="16px">
          <NmorphIconVideoCamera />
        </NmorphIcon>
      </NmorphButton>
      <NmorphButton
        v-if="callStatusItem.canLeave"
        shape="square"
        style-type="transparent"
        :aria-label="$t(CALL_STATUS_I18N.leaveRoomCall)"
        :title="$t(CALL_STATUS_I18N.leaveRoomCall)"
        :loading="isCallStatusActionLoading"
        :disabled="isCallStatusActionLoading"
        @click="leaveRoomCall"
      >
        <NmorphIcon width="16px" height="16px">
          <NmorphIconClose />
        </NmorphIcon>
      </NmorphButton>
    </div>
  </NmorphCard>
</template>

<style lang="scss">
.call-status--openable {
  cursor: pointer;
}

.call-status__content {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
  --nmorph-card-content-padding: 0 0 0 10px;
}

.call-status__dot {
  position: relative;

  flex: 0 0 auto;

  width: 10px;
  height: 10px;

  background: var(--call-status-dot-color);
  border-radius: 999px;
}

.call-status__dot::before {
  content: '';

  position: absolute;
  inset: -5px;

  background: var(--call-status-dot-color);
  border-radius: inherit;
  opacity: 0.35;

  animation: call-status-dot-pulse 1.6s ease-out infinite;
}

@keyframes call-status-dot-pulse {
  from {
    transform: scale(0.65);
    opacity: 0.5;
  }

  to {
    transform: scale(1.65);
    opacity: 0;
  }
}
</style>
