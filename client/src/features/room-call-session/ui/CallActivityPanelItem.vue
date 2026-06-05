<script setup lang="ts">
import {
  NmorphButton,
  NmorphIcon,
  NmorphIconClose,
  NmorphIconPhone,
  NmorphIconVideoCamera
} from '@nmorph/nmorph-ui-kit'
import { ROOM_CALL_MEDIA_KIND } from 'global-shared'
import { computed } from 'vue'

import { AppHeader, AppText } from 'src/shared/ui'

import { ROOM_CALL_ACTIVITY_KIND } from '../config/constants'
import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { CallActivityPanelItemEmits, CallActivityPanelItemProps } from '../config/types'

const props = defineProps<CallActivityPanelItemProps>()
const emit = defineEmits<CallActivityPanelItemEmits>()

const audioButtonText = computed(() =>
  props.item.isPrivateRoom ? ROOM_CALL_SESSION_I18N.answerAudioRoomCall : ROOM_CALL_SESSION_I18N.joinAudioRoomCall
)
const videoButtonText = computed(() =>
  props.item.isPrivateRoom ? ROOM_CALL_SESSION_I18N.answerVideoRoomCall : ROOM_CALL_SESSION_I18N.joinVideoRoomCall
)
const showJoinControls = computed(() =>
  props.compact ? props.item.kind === ROOM_CALL_ACTIVITY_KIND.INCOMING : props.item.canJoin
)
</script>

<template>
  <div
    class="call-activity-panel-item"
    :class="{ 'call-activity-panel-item--compact': props.compact }"
    :style="{ '--call-activity-panel-dot-color': props.item.dotColor }"
  >
    <div class="call-activity-panel-item__label">
      <span class="call-activity-panel-item__dot" />
      <AppText
        v-if="props.compact"
        class="call-activity-panel-item__text"
        tag="small"
        truncate
        :selectable="false"
        :text="props.item.text"
      />
      <AppHeader
        v-else
        class="call-activity-panel-item__title"
        tag="h3"
        alignment="center"
        :selectable="false"
        :text="props.item.text"
      />
    </div>
    <div
      class="call-activity-panel-item__actions"
      @click.stop="emit('open')"
      @pointerdown.stop
      @pointermove.stop
      @pointerup.stop
      @pointercancel.stop
      @pointerleave.stop
      @wheel.stop
    >
      <template v-if="showJoinControls">
        <NmorphButton
          shape="square"
          style-type="transparent"
          :aria-label="$t(audioButtonText)"
          :loading="props.loadingMediaKind === ROOM_CALL_MEDIA_KIND.AUDIO"
          :disabled="props.loading || props.disabled"
          @click="emit('join-audio')"
        >
          <NmorphIcon width="16px" height="16px">
            <NmorphIconPhone />
          </NmorphIcon>
        </NmorphButton>
        <NmorphButton
          shape="square"
          style-type="transparent"
          :aria-label="$t(videoButtonText)"
          :loading="props.loadingMediaKind === ROOM_CALL_MEDIA_KIND.VIDEO"
          :disabled="props.loading || props.disabled"
          @click="emit('join-video')"
        >
          <NmorphIcon width="16px" height="16px">
            <NmorphIconVideoCamera />
          </NmorphIcon>
        </NmorphButton>
      </template>
      <NmorphButton
        v-if="props.item.canLeave"
        shape="square"
        style-type="transparent"
        :aria-label="$t(ROOM_CALL_SESSION_I18N.leaveRoomCall)"
        :loading="props.leaveLoading"
        :disabled="props.leaveLoading || props.disabled"
        @click.stop="emit('leave')"
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
  display: grid;
  gap: 16px;
  justify-items: center;
}

.call-activity-panel-item--compact {
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 12px;
  place-items: center stretch;

  box-sizing: border-box;
  min-width: 0;
  padding-left: 10px;
}

.call-activity-panel-item__label {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.call-activity-panel-item:not(.call-activity-panel-item--compact) .call-activity-panel-item__label {
  justify-content: center;
}

.call-activity-panel-item__dot {
  position: relative;

  flex: 0 0 auto;

  width: 3px;
  height: 14px;
  border-radius: 999px;

  background: var(--call-activity-panel-dot-color);
}

.call-activity-panel-item:not(.call-activity-panel-item--compact) .call-activity-panel-item__dot {
  height: 20px;
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

.call-activity-panel-item__text,
.call-activity-panel-item__title {
  min-width: 0;
}

.call-activity-panel-item--compact .call-activity-panel-item__text {
  flex: 1 1 auto;
}

.call-activity-panel-item__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.call-activity-panel-item--compact .call-activity-panel-item__actions {
  flex: 0 0 auto;
  flex-wrap: nowrap;
  gap: 0;
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
