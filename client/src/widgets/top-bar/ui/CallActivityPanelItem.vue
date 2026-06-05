<script setup lang="ts">
import {
  NmorphButton,
  NmorphIcon,
  NmorphIconClose,
  NmorphIconMuteNotification,
  NmorphIconPhone,
  NmorphIconVideoCamera
} from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CALL_ACTIVITY_PANEL_I18N } from '../config/i18n'
import type { CallActivityPanelItem } from '../config/types'

defineProps<{
  acceptAudioLoading: boolean
  acceptVideoLoading: boolean
  disabled: boolean
  item: CallActivityPanelItem
  loading: boolean
  leaveLoading: boolean
}>()

const emit = defineEmits<{
  acceptAudio: []
  acceptVideo: []
  leave: []
  mute: []
}>()
</script>

<template>
  <div class="call-activity-panel-item" :style="{ '--call-activity-panel-dot-color': item.dotColor }">
    <span class="call-activity-panel-item__dot" />
    <AppText class="call-activity-panel-item__text" tag="small" truncate :selectable="false" :text="item.text" />
    <div
      v-if="item.canAccept || item.canMute || item.canLeave"
      class="call-activity-panel-item__actions"
      @click.stop
      @pointerdown.stop
      @pointermove.stop
      @pointerup.stop
      @pointercancel.stop
      @pointerleave.stop
      @wheel.stop
    >
      <NmorphButton
        v-if="item.canAccept"
        shape="square"
        style-type="transparent"
        :aria-label="$t(CALL_ACTIVITY_PANEL_I18N.acceptAudioRoomCall)"
        :title="$t(CALL_ACTIVITY_PANEL_I18N.acceptAudioRoomCall)"
        :loading="acceptAudioLoading"
        :disabled="acceptAudioLoading || loading || disabled"
        @click="emit('acceptAudio')"
      >
        <NmorphIcon width="16px" height="16px">
          <NmorphIconPhone />
        </NmorphIcon>
      </NmorphButton>
      <NmorphButton
        v-if="item.canAccept"
        shape="square"
        style-type="transparent"
        :aria-label="$t(CALL_ACTIVITY_PANEL_I18N.acceptVideoRoomCall)"
        :title="$t(CALL_ACTIVITY_PANEL_I18N.acceptVideoRoomCall)"
        :loading="acceptVideoLoading"
        :disabled="acceptVideoLoading || loading || disabled"
        @click="emit('acceptVideo')"
      >
        <NmorphIcon width="16px" height="16px">
          <NmorphIconVideoCamera />
        </NmorphIcon>
      </NmorphButton>
      <NmorphButton
        v-if="item.canMute"
        shape="square"
        style-type="transparent"
        :aria-label="$t(CALL_ACTIVITY_PANEL_I18N.muteIncomingRoomCall)"
        :title="$t(CALL_ACTIVITY_PANEL_I18N.muteIncomingRoomCall)"
        :disabled="loading || disabled"
        @click="emit('mute')"
      >
        <NmorphIcon width="16px" height="16px">
          <NmorphIconMuteNotification />
        </NmorphIcon>
      </NmorphButton>
      <NmorphButton
        v-if="item.canLeave"
        shape="square"
        style-type="transparent"
        :aria-label="$t(CALL_ACTIVITY_PANEL_I18N.leaveRoomCall)"
        :title="$t(CALL_ACTIVITY_PANEL_I18N.leaveRoomCall)"
        :loading="leaveLoading"
        :disabled="leaveLoading || loading || disabled"
        @click="emit('leave')"
      >
        <NmorphIcon width="16px" height="16px">
          <NmorphIconClose />
        </NmorphIcon>
      </NmorphButton>
    </div>
  </div>
</template>

<style lang="scss">
.call-activity-panel-item {
  display: flex;
  gap: 12px;
  align-items: center;

  box-sizing: border-box;
  min-width: 0;
  padding-left: 10px;
}

.call-activity-panel-item__dot {
  position: relative;

  flex: 0 0 auto;

  width: 3px;
  height: 14px;
  border-radius: 999px;

  background: var(--call-activity-panel-dot-color);
}

.call-activity-panel-item__dot::before {
  content: '';

  position: absolute;
  inset: -4px -5px;

  border-radius: inherit;

  opacity: 0.35;
  background: var(--call-activity-panel-dot-color);

  animation: call-activity-panel-item-dot-pulse 1.6s ease-out infinite;
}

.call-activity-panel-item__text {
  flex: 1 1 auto;
  min-width: 0;
}

.call-activity-panel-item__actions {
  display: flex;
  flex: 0 0 auto;
}

@keyframes call-activity-panel-item-dot-pulse {
  from {
    transform: scaleX(0.7) scaleY(0.8);
    opacity: 0.5;
  }

  to {
    transform: scaleX(1.8) scaleY(1.35);
    opacity: 0;
  }
}
</style>
