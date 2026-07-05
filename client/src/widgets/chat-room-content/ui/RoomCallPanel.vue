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

import { ROOM_CALL_SESSION_I18N, RoomCallDeviceMenu } from 'src/features/room-call-session'

import {
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
  isLocalHandRaised,
  isRoomCallFocusDisplayMode,
  isRoomCallQuickCommandsExpanded,
  isRoomCallQuickCommandsAvailable,
  isRoomCallFullscreen,
  isScreenSharingControlDisabled,
  isScreenSharingControlVisible,
  leaveRoomCall,
  roomCallDisplayModeToggleI18n,
  roomCallMainTileItem,
  roomCallPanelTilesStyle,
  roomCallSecondaryTileItems,
  roomCallTileItems,
  sendRoomCallQuickCommand,
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
    <div
      class="room-call-panel__tiles"
      :style="roomCallPanelTilesStyle"
      :class="{
        'room-call-panel__tiles--focus': isRoomCallFocusDisplayMode
      }"
    >
      <template v-if="isRoomCallFocusDisplayMode && roomCallMainTileItem">
        <RoomCallTile
          class="room-call-panel__tile room-call-panel__tile--main"
          :item="roomCallMainTileItem"
          main
          :self="roomCallMainTileItem.isLocal"
          @select="focusRoomCallTile(roomCallMainTileItem)"
        />
        <NmorphScroll
          v-if="roomCallSecondaryTileItems.length"
          class="room-call-panel__filmstrip"
          height="120px"
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
          :disabled="!isRoomCallQuickCommandsAvailable"
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
              v-if="command.id === 'raise-hand'"
              class="room-call-panel__quick-command room-call-panel__quick-command--icon"
              design="plain"
              borderless
              thickness="thin"
              shape="circle"
              :active="isLocalHandRaised"
              :disabled="!isRoomCallQuickCommandsAvailable"
              :aria-label="$t(command.i18n)"
              @click="sendRoomCallQuickCommand(command.id)"
            >
              <template #icon-only>
                <NmorphIcon width="15px" height="15px">
                  <NmorphIconHand />
                </NmorphIcon>
              </template>
            </NmorphButton>
            <NmorphButton
              v-if="command.id !== 'raise-hand'"
              class="room-call-panel__quick-command room-call-panel__quick-command--text"
              design="plain"
              borderless
              thickness="thin"
              :disabled="!isRoomCallQuickCommandsAvailable"
              :aria-label="$t(command.i18n)"
              :text="$t(command.i18n)"
              @click="sendRoomCallQuickCommand(command.id)"
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
          <RoomCallDeviceMenu :disabled="props.isBusy" />
          <NmorphButton
            v-if="isScreenSharingControlVisible"
            design="plain"
            borderless
            shape="circle"
            :active="props.localMediaState.screen"
            :disabled="isScreenSharingControlDisabled"
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

<style lang="scss" scoped>
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
  grid-auto-flow: column;
  grid-template-columns: repeat(var(--room-call-panel-grid-column-count), minmax(0, 1fr));
  grid-template-rows: repeat(var(--room-call-panel-grid-row-count), minmax(0, 1fr));
  flex: 1;
  gap: 8px;
  align-content: stretch;

  min-height: 0;
}

.room-call-panel__tiles--focus {
  position: relative;
  overflow: hidden;
  display: block;
}

.room-call-panel__tile--main {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  min-height: 0;
}

.room-call-panel__tiles--focus > .room-call-panel__filmstrip {
  position: absolute;
  z-index: 1;
  right: 8px;
  bottom: 8px;
  left: 8px;

  display: flex;
  gap: 8px;
  align-items: stretch;
}

.room-call-panel__filmstrip-tile {
  flex: 0 0 180px;
  height: 100%;
  background: var(--app-shadow-dark);
}

.room-call-panel__filmstrip-tile :deep(.room-call-tile__media.app-media-tile) {
  background: var(--app-shadow-dark);
}

.room-call-panel__bottom {
  --room-call-panel-quick-commands-toggle-width: 48px;
  --room-call-panel-quick-command-icon-width: 28px;
  --room-call-panel-quick-command-text-min-width: 56px;
  --room-call-panel-quick-command-gap: 4px;
  --room-call-panel-quick-commands-expanded-width: calc(
    var(--room-call-panel-quick-commands-toggle-width) + var(--room-call-panel-quick-command-icon-width) +
      var(--room-call-panel-quick-command-text-min-width) + var(--room-call-panel-quick-command-text-min-width) +
      var(--room-call-panel-quick-command-text-min-width) + var(--room-call-panel-quick-command-gap) +
      var(--room-call-panel-quick-command-gap) + var(--room-call-panel-quick-command-gap)
  );

  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: stretch;

  max-width: 100%;
}

.room-call-panel__quick-commands-bar,
.room-call-panel__self {
  border-radius: 8px;
  background: var(--app-shadow-dark);
}

.room-call-panel__quick-commands-bar {
  overflow: hidden;
  display: flex;
  flex: 0 1 var(--room-call-panel-quick-commands-toggle-width);
  align-items: center;
  justify-content: flex-start;

  box-sizing: border-box;
  width: var(--room-call-panel-quick-commands-toggle-width);
  min-width: var(--room-call-panel-quick-commands-toggle-width);
  max-width: 100%;

  transition: flex-basis 0.18s ease, width 0.18s ease;
}

.room-call-panel__quick-commands-bar--expanded {
  flex-basis: min(100%, var(--room-call-panel-quick-commands-expanded-width));
  width: min(100%, var(--room-call-panel-quick-commands-expanded-width));
}

.room-call-panel__quick-commands-toggle {
  display: flex;
  flex: 0 0 var(--room-call-panel-quick-commands-toggle-width);
  justify-content: center;
}

.room-call-panel__quick-commands {
  transform: translateX(100%);

  display: flex;
  flex: 0 0 auto;
  gap: var(--room-call-panel-quick-command-gap);
  align-items: center;

  transition: transform 0.18s ease;
}

.room-call-panel__quick-commands-bar--expanded .room-call-panel__quick-commands {
  transform: translateX(0);
}

.room-call-panel__quick-command {
  flex: 0 0 auto;
}

.room-call-panel__quick-command--icon {
  width: var(--room-call-panel-quick-command-icon-width);
  min-width: var(--room-call-panel-quick-command-icon-width);
}

.room-call-panel__quick-command--text {
  min-width: var(--room-call-panel-quick-command-text-min-width);
}

.room-call-panel__self {
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  flex: 1 1 180px;
  align-items: center;

  min-width: 0;
  max-width: 100%;
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

@media (width < 560px) {
  .room-call-panel__bottom {
    display: grid;
    grid-template-columns: var(--room-call-panel-quick-commands-toggle-width) minmax(0, 1fr) var(
        --room-call-panel-quick-commands-toggle-width
      );
  }

  .room-call-panel__quick-commands-bar {
    width: 100%;
    min-width: 0;
  }

  .room-call-panel__quick-commands-bar--expanded {
    grid-column: 1 / -1;
    width: 100%;
  }

  .room-call-panel__self {
    display: flex;
    grid-column: 2;
    gap: 6px;
    justify-content: center;

    padding: 8px;
  }

  .room-call-panel__quick-commands-bar--expanded + .room-call-panel__self {
    grid-column: 1 / -1;
  }

  .room-call-panel__self-controls,
  .room-call-panel__self-actions {
    grid-column: auto;
    flex: 0 0 auto;
    justify-self: auto;
  }
}
</style>
