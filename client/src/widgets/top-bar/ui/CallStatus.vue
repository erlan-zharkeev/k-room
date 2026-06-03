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

import { CALL_STATUS_I18N } from '../config/i18n'
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
  <Transition name="call-status-reveal">
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
      <AppText class="call-status__text" tag="small" truncate :selectable="false" :text="callStatusItem.text" />
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
  </Transition>
</template>

<style lang="scss">
.call-status--openable {
  cursor: pointer;
}

.call-status__content {
  --nmorph-card-content-padding: 0 0 0 10px;

  display: flex;
  gap: 12px;
  align-items: center;
}

.call-status__dot {
  position: relative;

  width: 10px;
  height: 10px;
  border-radius: 999px;

  background: var(--call-status-dot-color);
}

.call-status__dot::before {
  content: '';

  position: absolute;
  inset: -5px;

  border-radius: inherit;

  opacity: 0.35;
  background: var(--call-status-dot-color);

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

.call-status-reveal-enter-active {
  transform-origin: top center;
  animation: call-status-unfold 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.call-status-reveal-leave-active {
  transform-origin: top center;
  animation: call-status-fold 220ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes call-status-unfold {
  0% {
    transform: translateY(-8px) scaleX(0.98) scaleY(0.74);
    opacity: 0;
    clip-path: inset(0 0 82% 0 round 8px);
    filter: blur(6px);
  }

  58% {
    transform: translateY(1px) scaleX(1) scaleY(1.03);
    opacity: 1;
    clip-path: inset(0 0 0 0 round 8px);
    filter: blur(1px);
  }

  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
    clip-path: inset(0 0 0 0 round 8px);
    filter: blur(0);
  }
}

@keyframes call-status-fold {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
    clip-path: inset(0 0 0 0 round 8px);
    filter: blur(0);
  }

  36% {
    transform: translateY(-1px) scaleX(0.995) scaleY(0.96);
    opacity: 0.82;
    clip-path: inset(0 0 10% 0 round 8px);
    filter: blur(1px);
  }

  100% {
    transform: translateY(-7px) scaleX(0.98) scaleY(0.74);
    opacity: 0;
    clip-path: inset(0 0 82% 0 round 8px);
    filter: blur(6px);
  }
}
</style>
