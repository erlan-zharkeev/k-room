<script setup lang="ts">
import {
  NmorphButton,
  NmorphCard,
  NmorphIconClose,
  NmorphIcon,
  NmorphIconMuteNotification,
  NmorphIconPhone,
  NmorphIconVideoCamera
} from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CALL_ACTIVITY_PANEL_I18N } from '../config/i18n'
import { useCallActivityPanel } from '../model/use-call-activity-panel.model'

const {
  callActivityPanelItem,
  isCallActivityPanelActionLoading,
  acceptIncomingAudioRoomCall,
  acceptIncomingVideoRoomCall,
  leaveRoomCall,
  muteIncomingRoomCall,
  openRoomCall
} = useCallActivityPanel()
</script>

<template>
  <Transition name="call-activity-panel-reveal">
    <NmorphCard
      v-if="callActivityPanelItem"
      tag="section"
      shadow-type="inset"
      :fill="false"
      class="call-activity-panel"
      :class="{ 'call-activity-panel--openable': callActivityPanelItem.canOpen }"
      content-class="call-activity-panel__content"
      :role="callActivityPanelItem.canOpen && 'button'"
      :tabindex="callActivityPanelItem.canOpen && 0"
      :aria-label="callActivityPanelItem.canOpen && $t(CALL_ACTIVITY_PANEL_I18N.openRoomCall)"
      :style="{ '--call-activity-panel-dot-color': callActivityPanelItem.dotColor }"
      @click="openRoomCall"
      @keydown.enter.prevent="openRoomCall"
      @keydown.space.prevent="openRoomCall"
    >
      <span class="call-activity-panel__dot" />
      <AppText
        class="call-activity-panel__text"
        tag="small"
        truncate
        :selectable="false"
        :text="callActivityPanelItem.text"
      />
      <div
        v-if="callActivityPanelItem.canAccept || callActivityPanelItem.canMute || callActivityPanelItem.canLeave"
        class="call-activity-panel__actions"
        @click.stop
      >
        <NmorphButton
          v-if="callActivityPanelItem.canAccept"
          shape="square"
          style-type="transparent"
          :aria-label="$t(CALL_ACTIVITY_PANEL_I18N.acceptAudioRoomCall)"
          :title="$t(CALL_ACTIVITY_PANEL_I18N.acceptAudioRoomCall)"
          :loading="isCallActivityPanelActionLoading"
          :disabled="isCallActivityPanelActionLoading"
          @click="acceptIncomingAudioRoomCall"
        >
          <NmorphIcon width="16px" height="16px">
            <NmorphIconPhone />
          </NmorphIcon>
        </NmorphButton>
        <NmorphButton
          v-if="callActivityPanelItem.canAccept"
          shape="square"
          style-type="transparent"
          :aria-label="$t(CALL_ACTIVITY_PANEL_I18N.acceptVideoRoomCall)"
          :title="$t(CALL_ACTIVITY_PANEL_I18N.acceptVideoRoomCall)"
          :loading="isCallActivityPanelActionLoading"
          :disabled="isCallActivityPanelActionLoading"
          @click="acceptIncomingVideoRoomCall"
        >
          <NmorphIcon width="16px" height="16px">
            <NmorphIconVideoCamera />
          </NmorphIcon>
        </NmorphButton>
        <NmorphButton
          v-if="callActivityPanelItem.canMute"
          shape="square"
          style-type="transparent"
          :aria-label="$t(CALL_ACTIVITY_PANEL_I18N.muteIncomingRoomCall)"
          :title="$t(CALL_ACTIVITY_PANEL_I18N.muteIncomingRoomCall)"
          :disabled="isCallActivityPanelActionLoading"
          @click="muteIncomingRoomCall"
        >
          <NmorphIcon width="16px" height="16px">
            <NmorphIconMuteNotification />
          </NmorphIcon>
        </NmorphButton>
        <NmorphButton
          v-if="callActivityPanelItem.canLeave"
          shape="square"
          style-type="transparent"
          :aria-label="$t(CALL_ACTIVITY_PANEL_I18N.leaveRoomCall)"
          :title="$t(CALL_ACTIVITY_PANEL_I18N.leaveRoomCall)"
          :loading="isCallActivityPanelActionLoading"
          :disabled="isCallActivityPanelActionLoading"
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
.call-activity-panel--openable {
  cursor: pointer;
}

.call-activity-panel__content {
  --nmorph-card-content-padding: 0 0 0 10px;

  display: flex;
  gap: 12px;
  align-items: center;
}

.call-activity-panel__dot {
  position: relative;

  width: 10px;
  height: 10px;
  border-radius: 999px;

  background: var(--call-activity-panel-dot-color);
}

.call-activity-panel__dot::before {
  content: '';

  position: absolute;
  inset: -5px;

  border-radius: inherit;

  opacity: 0.35;
  background: var(--call-activity-panel-dot-color);

  animation: call-activity-panel-dot-pulse 1.6s ease-out infinite;
}

@keyframes call-activity-panel-dot-pulse {
  from {
    transform: scale(0.65);
    opacity: 0.5;
  }

  to {
    transform: scale(1.65);
    opacity: 0;
  }
}

.call-activity-panel-reveal-enter-active {
  transform-origin: top center;
  animation: call-activity-panel-unfold 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.call-activity-panel-reveal-leave-active {
  transform-origin: top center;
  animation: call-activity-panel-fold 220ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes call-activity-panel-unfold {
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

@keyframes call-activity-panel-fold {
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
