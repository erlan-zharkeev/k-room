<script setup lang="ts">
import { NmorphCard, NmorphStepper } from '@nmorph/nmorph-ui-kit'
import { computed, toRef } from 'vue'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { RoomCallActivityPanelEmits, RoomCallActivityPanelProps } from '../config/types'
import { useRoomCallActivity } from '../model/use-room-call-activity.model'

import RoomCallActivityPanelItem from './RoomCallActivityPanelItem.vue'

const props = withDefaults(defineProps<RoomCallActivityPanelProps>(), {
  compact: true,
  openable: true
})
const emit = defineEmits<RoomCallActivityPanelEmits>()
const roomId = toRef(props, 'roomId')
const isOpenEnabled = computed(() => props.openable)
const {
  activityItem,
  activityItems,
  activityStepperIndex,
  joiningMediaKind,
  isActivityActionLoading,
  isActivityDisabled,
  isActivityLeaveLoading,
  isActivityOpenable,
  joinCurrentRoomCallWithAudio,
  joinCurrentRoomCallWithVideo,
  leaveCurrentRoomCall,
  muteCurrentIncomingRoomCall,
  openCurrentRoomCall
} = useRoomCallActivity({
  roomId,
  isOpenEnabled,
  openRoomCall: (targetRoomId) => emit('open-room-call', targetRoomId)
})

const hasMultipleActivityItems = computed(() => activityItems.value.length > 1)
</script>

<template>
  <Transition v-if="props.compact" name="room-call-activity-panel-reveal">
    <NmorphCard
      v-if="activityItem"
      tag="section"
      shadow-type="inset"
      :fill="false"
      class="room-call-activity-panel room-call-activity-panel--compact"
      :class="{
        'room-call-activity-panel--disabled': isActivityDisabled,
        'room-call-activity-panel--openable': isActivityOpenable,
        'room-call-activity-panel--single': activityItems.length === 1
      }"
      content-class="room-call-activity-panel__content"
      :role="isActivityOpenable && 'button'"
      :tabindex="isActivityOpenable && 0"
      :aria-disabled="isActivityDisabled"
      :aria-label="isActivityOpenable && $t(ROOM_CALL_SESSION_I18N.openRoomCall)"
      @click="openCurrentRoomCall"
      @keydown.enter.prevent="openCurrentRoomCall"
      @keydown.space.prevent="openCurrentRoomCall"
    >
      <NmorphStepper
        v-if="hasMultipleActivityItems"
        v-model="activityStepperIndex"
        class="room-call-activity-panel__stepper"
        :count="activityItems.length"
        :swipe="true"
        :wheel="true"
      >
        <RoomCallActivityPanelItem
          v-for="item in activityItems"
          :key="item.roomCall.id"
          :item="item"
          :compact="props.compact"
          :loading="isActivityActionLoading"
          :loading-media-kind="joiningMediaKind"
          :disabled="isActivityDisabled"
          :leave-loading="isActivityLeaveLoading"
          @join-audio="joinCurrentRoomCallWithAudio"
          @join-video="joinCurrentRoomCallWithVideo"
          @leave="leaveCurrentRoomCall"
          @mute="muteCurrentIncomingRoomCall"
        />
        <template #indicator="{ index, count, goTo }">
          <div v-if="count > 1" class="room-call-activity-panel__indicator" @click.stop>
            <button
              v-for="indicatorIndex in count"
              :key="indicatorIndex"
              type="button"
              class="room-call-activity-panel__indicator-button"
              :class="{
                'room-call-activity-panel__indicator-button--active': indicatorIndex - 1 === index
              }"
              :disabled="isActivityActionLoading || isActivityDisabled"
              :aria-current="indicatorIndex - 1 === index"
              :aria-label="`${indicatorIndex}/${count}`"
              @click="goTo(indicatorIndex - 1)"
            />
          </div>
        </template>
      </NmorphStepper>
      <RoomCallActivityPanelItem
        v-else
        :item="activityItem"
        :compact="props.compact"
        :loading="isActivityActionLoading"
        :loading-media-kind="joiningMediaKind"
        :disabled="isActivityDisabled"
        :leave-loading="isActivityLeaveLoading"
        @join-audio="joinCurrentRoomCallWithAudio"
        @join-video="joinCurrentRoomCallWithVideo"
        @leave="leaveCurrentRoomCall"
        @mute="muteCurrentIncomingRoomCall"
      />
    </NmorphCard>
  </Transition>
  <div v-else-if="activityItem" class="room-call-activity-panel room-call-activity-panel--large">
    <NmorphStepper
      v-if="hasMultipleActivityItems"
      v-model="activityStepperIndex"
      class="room-call-activity-panel__stepper"
      :count="activityItems.length"
      :swipe="true"
      :wheel="true"
    >
      <RoomCallActivityPanelItem
        v-for="item in activityItems"
        :key="item.roomCall.id"
        :item="item"
        :compact="props.compact"
        :loading="isActivityActionLoading"
        :loading-media-kind="joiningMediaKind"
        :disabled="isActivityDisabled"
        :leave-loading="isActivityLeaveLoading"
        @join-audio="joinCurrentRoomCallWithAudio"
        @join-video="joinCurrentRoomCallWithVideo"
        @leave="leaveCurrentRoomCall"
        @mute="muteCurrentIncomingRoomCall"
      />
      <template #indicator="{ index, count, goTo }">
        <div v-if="count > 1" class="room-call-activity-panel__indicator" @click.stop>
          <button
            v-for="indicatorIndex in count"
            :key="indicatorIndex"
            type="button"
            class="room-call-activity-panel__indicator-button"
            :class="{
              'room-call-activity-panel__indicator-button--active': indicatorIndex - 1 === index
            }"
            :disabled="isActivityActionLoading || isActivityDisabled"
            :aria-current="indicatorIndex - 1 === index"
            :aria-label="`${indicatorIndex}/${count}`"
            @click="goTo(indicatorIndex - 1)"
          />
        </div>
      </template>
    </NmorphStepper>
    <RoomCallActivityPanelItem
      v-else
      :item="activityItem"
      :compact="props.compact"
      :loading="isActivityActionLoading"
      :loading-media-kind="joiningMediaKind"
      :disabled="isActivityDisabled"
      :leave-loading="isActivityLeaveLoading"
      @join-audio="joinCurrentRoomCallWithAudio"
      @join-video="joinCurrentRoomCallWithVideo"
      @leave="leaveCurrentRoomCall"
      @mute="muteCurrentIncomingRoomCall"
    />
  </div>
</template>

<style lang="scss">
.room-call-activity-panel--openable {
  cursor: pointer;
}

.room-call-activity-panel--compact {
  interpolate-size: allow-keywords;
  width: min(320px, 42vw);
  max-width: min(320px, 42vw);
  transition: width 180ms ease;
}

.room-call-activity-panel--single {
  width: fit-content;
}

.room-call-activity-panel--disabled {
  @include disabled-state;
}

.room-call-activity-panel--large {
  @include flex-column-center;

  height: 100%;
}

.room-call-activity-panel__content {
  --nmorph-card-content-padding: 0;

  position: relative;
  width: 100%;
}

.room-call-activity-panel__stepper {
  width: 100%;
}

.room-call-activity-panel__indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.room-call-activity-panel--large .room-call-activity-panel__indicator {
  position: static;
  transform: none;
  margin-top: 16px;
}

.room-call-activity-panel__indicator-button {
  cursor: pointer;

  width: 10px;
  height: 3px;
  padding: 0;
  border: 0;

  background: var(--nmorph-placeholder-text-color);
}

.room-call-activity-panel__indicator-button--active {
  background: var(--nmorph-accent-color);
}

.room-call-activity-panel-reveal-enter-active {
  transform-origin: top center;
  animation: room-call-activity-panel-unfold 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.room-call-activity-panel-reveal-leave-active {
  transform-origin: top center;
  animation: room-call-activity-panel-fold 220ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes room-call-activity-panel-unfold {
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

@keyframes room-call-activity-panel-fold {
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
