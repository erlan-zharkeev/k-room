<script setup lang="ts">
import {
  NmorphButton,
  NmorphIcon,
  NmorphIconClose,
  NmorphIconExpand,
  NmorphIconFullScreen,
  NmorphIconGrid,
  NmorphIconHand,
  NmorphIconMicrophone,
  NmorphIconMonitor,
  NmorphIconMute,
  NmorphIconListSimple,
  NmorphIconShrink,
  NmorphIconVideoCamera,
  NmorphScroll,
  NmorphIconVideoCameraOff
} from '@nmorph/nmorph-ui-kit'

import { ROOM_CALL_SESSION_I18N } from 'src/features/room-call-session'

import {
  ROOM_CALL_QUICK_COMMAND,
  ROOM_CALL_QUICK_COMMAND_ICON_SIZE,
  ROOM_CALL_QUICK_COMMANDS,
  ROOM_CALL_QUICK_COMMANDS_TOGGLE_I18N,
  ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE
} from '../config/constants'
import type { RoomCallPanelEmits, RoomCallPanelProps } from '../config/types'
import { useRoomCallPanel } from '../model/use-room-call-panel.model'

import RoomCallTile from './RoomCallTile.vue'

const props = defineProps<RoomCallPanelProps>()
const emit = defineEmits<RoomCallPanelEmits>()
const {
  focusRoomCallTile,
  isRoomCallFocusDisplayMode,
  isRoomCallQuickCommandsExpanded,
  isRoomCallFullscreen,
  isScreenSharingControlVisible,
  leaveRoomCall,
  roomCallDisplayModeToggleI18n,
  roomCallMainTileItem,
  roomCallSecondaryTileItems,
  roomCallTileItems,
  toggleRoomCallPanelDisplayMode,
  toggleRoomCallQuickCommands,
  toggleRoomCallFullscreen,
  toggleScreenSharing,
  updateAudioEnabled,
  updateVideoEnabled
} = useRoomCallPanel(props, emit)
</script>

<template>
  <div ref="roomCallPanel" class="room-call-panel">
    <div class="room-call-panel__tiles" :class="{ 'room-call-panel__tiles--focus': isRoomCallFocusDisplayMode }">
      <template v-if="isRoomCallFocusDisplayMode && roomCallMainTileItem">
        <RoomCallTile
          class="room-call-panel__tile room-call-panel__tile--main"
          :item="roomCallMainTileItem"
          :self="roomCallMainTileItem.isLocal"
          @select="focusRoomCallTile(roomCallMainTileItem)"
        />
        <NmorphScroll
          v-if="roomCallSecondaryTileItems.length"
          class="room-call-panel__filmstrip"
          scroll-x-prop="auto"
          scroll-y-prop="hidden"
          :x-gap-in-px="4"
        >
          <RoomCallTile
            v-for="item in roomCallSecondaryTileItems"
            :key="item.id"
            class="room-call-panel__tile room-call-panel__filmstrip-tile"
            :item="item"
            :self="item.isLocal"
            @select="focusRoomCallTile(item)"
          />
        </NmorphScroll>
      </template>
      <template v-else>
        <RoomCallTile
          v-for="item in roomCallTileItems"
          :key="item.id"
          class="room-call-panel__tile"
          :item="item"
          :self="item.isLocal"
          @select="focusRoomCallTile(item)"
        />
      </template>
    </div>
    <div class="room-call-panel__bottom">
      <div
        class="room-call-panel__quick-commands-bar"
        :class="{ 'room-call-panel__quick-commands-bar--expanded': isRoomCallQuickCommandsExpanded }"
      >
        <NmorphButton
          class="room-call-panel__quick-commands-toggle"
          design="plain"
          borderless
          shape="circle"
          :aria-label="$t(ROOM_CALL_QUICK_COMMANDS_TOGGLE_I18N)"
          @click="toggleRoomCallQuickCommands"
        >
          <template #icon-only>
            <NmorphIcon>
              <NmorphIconShrink v-if="isRoomCallQuickCommandsExpanded" />
              <NmorphIconExpand v-else />
            </NmorphIcon>
          </template>
        </NmorphButton>
        <div
          class="room-call-panel__quick-commands"
          :aria-hidden="!isRoomCallQuickCommandsExpanded"
          :inert="!isRoomCallQuickCommandsExpanded"
        >
          <template v-for="command in ROOM_CALL_QUICK_COMMANDS" :key="command.id">
            <NmorphButton
              v-if="command.id === ROOM_CALL_QUICK_COMMAND.RAISE_HAND"
              class="room-call-panel__quick-command"
              design="plain"
              borderless
              thickness="thin"
              shape="circle"
              :aria-label="$t(command.i18n)"
            >
              <template #icon-only>
                <NmorphIcon :width="ROOM_CALL_QUICK_COMMAND_ICON_SIZE" :height="ROOM_CALL_QUICK_COMMAND_ICON_SIZE">
                  <NmorphIconHand />
                </NmorphIcon>
              </template>
            </NmorphButton>
            <NmorphButton
              v-else
              class="room-call-panel__quick-command"
              design="plain"
              borderless
              thickness="thin"
              :aria-label="$t(command.i18n)"
              :text="$t(command.i18n)"
            >
            </NmorphButton>
          </template>
        </div>
      </div>
      <div class="room-call-panel__self">
        <div class="room-call-panel__self-controls">
          <NmorphButton
            design="plain"
            borderless
            shape="circle"
            :active="props.localMediaState.audio"
            :disabled="props.isBusy"
            :aria-label="$t(ROOM_CALL_SESSION_I18N.toggleAudioRoomCall)"
            @click="updateAudioEnabled"
          >
            <template #icon-only>
              <NmorphIcon
                :width="ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE"
                :height="ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE"
              >
                <NmorphIconMicrophone v-if="props.localMediaState.audio" />
                <NmorphIconMute v-else />
              </NmorphIcon>
            </template>
          </NmorphButton>
          <NmorphButton
            design="plain"
            borderless
            shape="circle"
            :active="props.localMediaState.video"
            :disabled="props.isBusy"
            :aria-label="$t(ROOM_CALL_SESSION_I18N.toggleVideoRoomCall)"
            @click="updateVideoEnabled"
          >
            <template #icon-only>
              <NmorphIcon
                :width="ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE"
                :height="ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE"
              >
                <NmorphIconVideoCamera v-if="props.localMediaState.video" />
                <NmorphIconVideoCameraOff v-else />
              </NmorphIcon>
            </template>
          </NmorphButton>
          <NmorphButton
            v-if="isScreenSharingControlVisible"
            design="plain"
            borderless
            shape="circle"
            :active="props.localMediaState.screen"
            :disabled="props.isBusy"
            :aria-label="$t(ROOM_CALL_SESSION_I18N.toggleScreenRoomCall)"
            @click="toggleScreenSharing"
          >
            <template #icon-only>
              <NmorphIcon
                :width="ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE"
                :height="ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE"
              >
                <NmorphIconMonitor />
              </NmorphIcon>
            </template>
          </NmorphButton>
          <NmorphButton
            design="plain"
            borderless
            shape="circle"
            :disabled="props.isBusy && !props.isLeaving"
            :loading="props.isLeaving"
            :aria-label="$t(ROOM_CALL_SESSION_I18N.leaveRoomCall)"
            @click="leaveRoomCall"
          >
            <template #icon-only>
              <NmorphIcon
                :width="ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE"
                :height="ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE"
              >
                <NmorphIconClose />
              </NmorphIcon>
            </template>
          </NmorphButton>
        </div>
        <div class="room-call-panel__self-actions">
          <NmorphButton
            class="room-call-panel__display-mode"
            design="plain"
            borderless
            shape="circle"
            :aria-label="$t(roomCallDisplayModeToggleI18n)"
            @click="toggleRoomCallPanelDisplayMode"
          >
            <template #icon-only>
              <NmorphIcon>
                <NmorphIconGrid v-if="isRoomCallFocusDisplayMode" />
                <NmorphIconListSimple v-else />
              </NmorphIcon>
            </template>
          </NmorphButton>
          <NmorphButton
            class="room-call-panel__fullscreen"
            design="plain"
            borderless
            shape="circle"
            :aria-label="
              $t(
                isRoomCallFullscreen
                  ? ROOM_CALL_SESSION_I18N.exitFullscreenRoomCall
                  : ROOM_CALL_SESSION_I18N.enterFullscreenRoomCall
              )
            "
            @click="toggleRoomCallFullscreen"
          >
            <template #icon-only>
              <NmorphIcon>
                <NmorphIconShrink v-if="isRoomCallFullscreen" />
                <NmorphIconFullScreen v-else />
              </NmorphIcon>
            </template>
          </NmorphButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.room-call-panel {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 8px;

  height: 100%;
  min-height: 0;
}

.room-call-panel:fullscreen {
  width: 100%;
  height: 100%;
  padding: 12px;
  background: var(--nmorph-main-color);
}

.room-call-panel__tiles {
  overflow: auto;
  display: grid;
  grid-auto-rows: minmax(0, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  flex: 1;
  gap: 8px;
  align-content: stretch;

  min-height: 0;
}

.room-call-panel__tiles--focus {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.room-call-panel__tile--main {
  flex: 1;
  align-self: center;
  width: 100%;
  min-height: 0;
}

.room-call-panel__filmstrip {
  display: flex;
  flex: 0 0 132px;
  gap: 8px;
}

.room-call-panel__filmstrip-tile {
  flex: 0 0 180px;
}

.room-call-panel__bottom {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.room-call-panel__quick-commands-bar,
.room-call-panel__self {
  border-radius: 8px;
  background: var(--app-shadow-dark);
}

.room-call-panel__quick-commands-bar {
  overflow: hidden;
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: flex-start;

  box-sizing: border-box;
  width: max-content;
  min-width: 48px;
  max-width: 48px;

  transition: max-width 0.16s ease;
}

.room-call-panel__quick-commands-bar--expanded {
  max-width: 100%;
}

.room-call-panel__quick-commands-toggle {
  display: flex;
  flex: 0 0 48px;
  justify-content: center;
}

.room-call-panel__quick-commands {
  display: flex;
  flex: 0 0 auto;
  gap: 4px;
  align-items: center;
}

.room-call-panel__self {
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  flex: 1;
  align-items: center;

  min-width: 0;
  padding: 8px 10px;
}

.room-call-panel__self-controls {
  display: flex;
  grid-column: 2;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.room-call-panel__self-actions {
  display: flex;
  grid-column: 3;
  gap: 6px;
  align-items: center;
  justify-self: end;
}
</style>
