<script setup lang="ts">
import {
  NmorphText,
  NmorphAvatar,
  NmorphButton,
  NmorphIcon,
  NmorphIconClose,
  NmorphIconPhone,
  NmorphIconVideoCamera
} from '@nmorph/nmorph-ui-kit'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { CallActivityPanelItemEmits, CallActivityPanelItemProps } from '../config/types'
import { useCallActivityPanelItem } from '../model/use-call-activity-panel-item.model'

const props = defineProps<CallActivityPanelItemProps>()
const emit = defineEmits<CallActivityPanelItemEmits>()
const {
  avatarImageSrc,
  audioButtonText,
  isAudioJoinLoading,
  isLargePrivateActivity,
  isVideoJoinLoading,
  showJoinControls,
  videoButtonText
} = useCallActivityPanelItem(props)
</script>

<template>
  <div
    class="call-activity-panel-item"
    :class="{ 'call-activity-panel-item--compact': props.compact }"
    :style="{ '--call-activity-panel-dot-color': props.item.dotColor }"
  >
    <NmorphAvatar
      v-if="isLargePrivateActivity"
      class="call-activity-panel-item__avatar"
      :src="avatarImageSrc"
      :alt="props.item.title"
      :name="props.item.title"
      :size="92"
      shape="circle"
      preview
    />
    <div class="call-activity-panel-item__label">
      <span class="call-activity-panel-item__dot" />
      <NmorphText
        v-if="props.compact"
        class="call-activity-panel-item__text"
        as="small"
        truncate
        variant="body-small"
        >{{ props.item.text }}</NmorphText
      >
      <NmorphText v-else class="call-activity-panel-item__title" as="h3" align="center" variant="title" weight="bold">{{
        props.item.text
      }}</NmorphText>
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
          design="plain"
          borderless
          :aria-label="$t(audioButtonText)"
          :loading="isAudioJoinLoading"
          :disabled="props.loading || props.disabled"
          @click="emit('join-audio')"
        >
          <NmorphIcon width="16px" height="16px">
            <NmorphIconPhone />
          </NmorphIcon>
        </NmorphButton>
        <NmorphButton
          shape="square"
          design="plain"
          borderless
          :aria-label="$t(videoButtonText)"
          :loading="isVideoJoinLoading"
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
        design="plain"
        borderless
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

.call-activity-panel-item__avatar {
  margin-bottom: 4px;
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
