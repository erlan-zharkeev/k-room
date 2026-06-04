<script setup lang="ts">
import { NmorphCard, NmorphStepper } from '@nmorph/nmorph-ui-kit'

import { CALL_ACTIVITY_PANEL_I18N } from '../config/i18n'
import { useCallActivityPanel } from '../model/use-call-activity-panel.model'

import CallActivityPanelItem from './CallActivityPanelItem.vue'

const {
  callActivityPanelItem,
  callActivityPanelItems,
  callActivityPanelStepperIndex,
  isCallActivityPanelActionLoading,
  isCallActivityPanelLeaveLoading,
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
      @click="openRoomCall"
      @keydown.enter.prevent="openRoomCall"
      @keydown.space.prevent="openRoomCall"
    >
      <NmorphStepper
        v-model="callActivityPanelStepperIndex"
        class="call-activity-panel__stepper"
        :count="callActivityPanelItems.length"
        :swipe="true"
        :wheel="true"
      >
        <CallActivityPanelItem
          v-for="item in callActivityPanelItems"
          :key="item.roomCall.id"
          :item="item"
          :loading="isCallActivityPanelActionLoading"
          :leave-loading="isCallActivityPanelLeaveLoading"
          @accept-audio="acceptIncomingAudioRoomCall"
          @accept-video="acceptIncomingVideoRoomCall"
          @leave="leaveRoomCall"
          @mute="muteIncomingRoomCall"
        />
        <template #indicator="{ index, count, goTo }">
          <div v-if="count > 1" class="call-activity-panel__indicator" @click.stop>
            <button
              v-for="indicatorIndex in count"
              :key="indicatorIndex"
              type="button"
              class="call-activity-panel__indicator-button"
              :class="{
                'call-activity-panel__indicator-button--active': indicatorIndex - 1 === index
              }"
              :disabled="isCallActivityPanelActionLoading"
              :aria-current="indicatorIndex - 1 === index"
              :aria-label="`${indicatorIndex}/${count}`"
              @click="goTo(indicatorIndex - 1)"
            />
          </div>
        </template>
      </NmorphStepper>
    </NmorphCard>
  </Transition>
</template>

<style lang="scss">
.call-activity-panel--openable {
  cursor: pointer;
}

.call-activity-panel {
  width: min(320px, 42vw);
}

.call-activity-panel__content {
  --nmorph-card-content-padding: 0;

  position: relative;
  width: 100%;
}

.call-activity-panel__stepper {
  width: 100%;
}

.call-activity-panel__indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.call-activity-panel__indicator-button {
  cursor: pointer;

  width: 10px;
  height: 3px;
  padding: 0;
  border: 0;

  background: var(--nmorph-placeholder-text-color);
}

.call-activity-panel__indicator-button--active {
  background: var(--nmorph-accent-color);
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
