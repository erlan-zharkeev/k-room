<script setup lang="ts">
import {
  NmorphButton,
  NmorphIcon,
  NmorphIconClose,
  NmorphIconFullScreen,
  NmorphIconGrid,
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

import { ROOM_CALL_QUICK_COMMANDS, ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { RoomCallPanelEmits, RoomCallPanelProps } from '../config/types'
import { useRoomCallPanel } from '../model/use-room-call-panel.model'

import RoomCallTile from './RoomCallTile.vue'

const props = defineProps<RoomCallPanelProps>()
const emit = defineEmits<RoomCallPanelEmits>()
const {
  closeRoomCallQuickCommands,
  focusRoomCallTile,
  isLocalHandRaised,
  isRoomCallFallbackFullscreen,
  isRoomCallFocusDisplayMode,
  isRoomCallQuickCommandsExpanded,
  isRoomCallQuickCommandsAvailable,
  isRoomCallFullscreen,
  isScreenSharingControlDisabled,
  isScreenSharingControlVisible,
  leaveRoomCall,
  roomCallDisplayModeToggleI18n,
  roomCallHandQuickCommandI18n,
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
  <div
    ref="roomCallPanel"
    class="room-call-panel"
    :class="{ 'room-call-panel--fallback-fullscreen': isRoomCallFallbackFullscreen }"
  >
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
      <div class="room-call-panel__self">
        <div class="room-call-panel__self-leading">
          <NmorphButton
            class="room-call-panel__quick-commands-toggle"
            design="plain"
            borderless
            shape="circle"
            color="var(--nmorph-accent-color)"
            :active="isRoomCallQuickCommandsExpanded"
            :disabled="!isRoomCallQuickCommandsAvailable"
            :aria-label="$t(CHAT_ROOM_CONTENT_I18N.roomCallQuickCommands)"
            :text="$t(CHAT_ROOM_CONTENT_I18N.roomCallQuickCommandsShortcut)"
            @click="toggleRoomCallQuickCommands"
          />
        </div>
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
          <RoomCallDeviceMenu :disabled="props.isBusy">
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
                <NmorphIcon width="17px" height="17px">
                  <NmorphIconMonitor />
                </NmorphIcon>
              </template>
            </NmorphButton>
            <NmorphButton
              class="room-call-panel__display-mode"
              design="plain"
              borderless
              shape="circle"
              :aria-label="$t(roomCallDisplayModeToggleI18n)"
              @click="toggleRoomCallPanelDisplayMode"
            >
              <template #icon-only>
                <NmorphIcon width="17px" height="17px">
                  <NmorphIconGrid v-if="isRoomCallFocusDisplayMode" />
                  <NmorphIconListSimple v-else />
                </NmorphIcon>
              </template>
            </NmorphButton>
          </RoomCallDeviceMenu>
          <NmorphButton
            design="plain"
            borderless
            shape="circle"
            color="var(--nmorph-error-text-color)"
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
      <div v-if="isRoomCallQuickCommandsExpanded" class="room-call-panel__quick-actions">
        <div class="room-call-panel__quick-actions-list">
          <template v-for="command in ROOM_CALL_QUICK_COMMANDS" :key="command.id">
            <NmorphButton
              v-if="command.id === 'raise-hand'"
              class="room-call-panel__quick-action"
              design="plain"
              borderless
              :active="isLocalHandRaised"
              :disabled="!isRoomCallQuickCommandsAvailable"
              :aria-label="$t(roomCallHandQuickCommandI18n)"
              :text="$t(roomCallHandQuickCommandI18n)"
              @click="sendRoomCallQuickCommand(command.id)"
            />
            <NmorphButton
              v-else
              class="room-call-panel__quick-action"
              design="plain"
              borderless
              :disabled="!isRoomCallQuickCommandsAvailable"
              :aria-label="$t(command.i18n)"
              :text="$t(command.i18n)"
              @click="sendRoomCallQuickCommand(command.id)"
            />
          </template>
        </div>
        <NmorphButton
          class="room-call-panel__quick-actions-close"
          design="plain"
          borderless
          shape="circle"
          :aria-label="$t(CHAT_ROOM_CONTENT_I18N.roomCallCloseQuickCommands)"
          @click="closeRoomCallQuickCommands"
        >
          <template #icon-only>
            <NmorphIcon>
              <NmorphIconClose />
            </NmorphIcon>
          </template>
        </NmorphButton>
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
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 12px;

  background: var(--nmorph-main-color);
}

.room-call-panel--fallback-fullscreen {
  position: fixed;
  z-index: 10000;
  inset: 0;

  box-sizing: border-box;
  width: 100vw;
  width: 100dvw;
  height: 100vh;
  height: 100dvh;
  padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right))
    max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));

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
  display: flex;
  flex-direction: column;
  gap: 8px;

  width: 100%;
  max-width: 100%;
}

.room-call-panel__self {
  display: flex;
  align-items: center;

  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 8px 10px;
  border-radius: 8px;

  background: var(--app-shadow-dark);
}

.room-call-panel__self-leading {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: flex-start;

  min-width: 0;
}

.room-call-panel__self-controls {
  display: flex;
  flex: 0 0 auto;
  gap: 6px;
  align-items: center;
}

.room-call-panel__self-actions {
  display: flex;
  flex: 1 1 0;
  gap: 6px;
  align-items: center;
  justify-content: flex-end;

  min-width: 0;
}

.room-call-panel__quick-actions {
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  align-items: center;

  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 8px;

  background: var(--app-shadow-dark);
}

.room-call-panel__quick-actions-list {
  display: flex;
  grid-column: 2;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.room-call-panel__quick-action {
  flex: 0 0 auto;
}

.room-call-panel__quick-actions-close {
  grid-column: 3;
  justify-self: end;
}

@media (width < 560px) {
  .room-call-panel__self {
    padding: 8px;
  }
}
</style>
