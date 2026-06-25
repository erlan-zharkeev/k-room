<script setup lang="ts">
import {
  NmorphText,
  NmorphAudioMeter,
  NmorphButton,
  NmorphIcon,
  NmorphIconMuteSpeaker,
  NmorphIconSpeaker,
  NmorphIconVideoCameraOff,
  NmorphIconEye,
  NmorphIconEyeBlocked,
  NmorphIconHand,
  NmorphIconMicrophone,
  NmorphIconMonitor,
  NmorphIconMute,
  NmorphIconVideoCamera,
  NmorphMediaTile
} from '@nmorph/nmorph-ui-kit'

import { ROOM_CALL_SESSION_I18N } from 'src/features/room-call-session'

import { ROOM_CALL_TILE_STATE_ICON_SIZE } from '../config/constants'
import type { RoomCallTileEmits, RoomCallTileProps } from '../config/types'
import { useRoomCallTile } from '../model/use-room-call-tile.model'

const props = defineProps<RoomCallTileProps>()
const emit = defineEmits<RoomCallTileEmits>()
const {
  avatarImageSrc,
  isMediaTileMuted,
  isMediaTileVideoOff,
  isRemoteAudioMuted,
  isRemoteVideoHidden,
  isRoomCallParticipantTile,
  isRoomCallScreenTile,
  isRoomCallTileAudioMeterVisible,
  isRoomCallTileQuickCommandsVisible,
  isRoomCallTileRemoteActionsVisible,
  remoteHideButtonText,
  remoteMuteButtonText,
  roomCallConnectionQualityBarItems,
  roomCallConnectionQualityClass,
  roomCallTileAudioVolumeDb,
  roomCallTileMediaFit,
  temporaryQuickCommandI18n,
  temporaryQuickCommandTextColor,
  toggleRemoteAudioMuted,
  toggleRemoteVideoHidden
} = useRoomCallTile(props)
</script>

<template>
  <div class="room-call-tile" :class="{ 'room-call-tile--screen': isRoomCallScreenTile }" @click="emit('select')">
    <NmorphMediaTile
      class="room-call-tile__media"
      :src-object="props.item.stream"
      :name="props.item.name"
      :avatar-src="avatarImageSrc"
      :mirrored="props.item.mirrored"
      :muted="isMediaTileMuted"
      :video-off="isMediaTileVideoOff"
      :show-status="false"
      aspect="fill"
      :fit="roomCallTileMediaFit"
      :screen-sharing="isRoomCallScreenTile"
      design="plain"
    />
    <div class="room-call-tile__top" @click.stop>
      <div class="room-call-tile__bar room-call-tile__overlay">
        <div class="room-call-tile__identity">
          <NmorphText
            class="room-call-tile__name"
            as="small"
            color="var(--nmorph-contrast-text-color)"
            truncate
            variant="body-small"
            >{{ props.item.name }}</NmorphText
          >
          <NmorphAudioMeter
            v-if="isRoomCallTileAudioMeterVisible"
            class="room-call-tile__audio-meter"
            :label="props.item.name"
            :volume-db="roomCallTileAudioVolumeDb"
            :bars="5"
          />
        </div>
        <div class="room-call-tile__states">
          <NmorphIcon
            v-if="isRoomCallParticipantTile"
            class="room-call-tile__state"
            :class="{ 'room-call-tile__state--off': !props.item.mediaState.audio }"
            :width="ROOM_CALL_TILE_STATE_ICON_SIZE"
            :height="ROOM_CALL_TILE_STATE_ICON_SIZE"
            :aria-label="$t(ROOM_CALL_SESSION_I18N.toggleAudioRoomCall)"
          >
            <NmorphIconMicrophone v-if="props.item.mediaState.audio" />
            <NmorphIconMute v-else />
          </NmorphIcon>
          <NmorphIcon
            v-if="isRoomCallParticipantTile"
            class="room-call-tile__state"
            :class="{ 'room-call-tile__state--off': !props.item.mediaState.video }"
            :width="ROOM_CALL_TILE_STATE_ICON_SIZE"
            :height="ROOM_CALL_TILE_STATE_ICON_SIZE"
            :aria-label="$t(ROOM_CALL_SESSION_I18N.toggleVideoRoomCall)"
          >
            <NmorphIconVideoCamera v-if="props.item.mediaState.video" />
            <NmorphIconVideoCameraOff v-else />
          </NmorphIcon>
          <NmorphIcon
            v-if="props.item.mediaState.screen"
            :width="ROOM_CALL_TILE_STATE_ICON_SIZE"
            :height="ROOM_CALL_TILE_STATE_ICON_SIZE"
            :aria-label="$t(ROOM_CALL_SESSION_I18N.toggleScreenRoomCall)"
          >
            <NmorphIconMonitor />
          </NmorphIcon>
        </div>
      </div>
      <div v-if="isRoomCallTileQuickCommandsVisible" class="room-call-tile__quick-commands">
        <div v-if="props.item.isHandRaised" class="room-call-tile__quick-command room-call-tile__quick-command--hand">
          <NmorphIcon
            :width="ROOM_CALL_TILE_STATE_ICON_SIZE"
            :height="ROOM_CALL_TILE_STATE_ICON_SIZE"
            color="var(--nmorph-accent-color)"
          >
            <NmorphIconHand />
          </NmorphIcon>
        </div>
        <div
          v-if="props.item.temporaryQuickCommand && temporaryQuickCommandI18n"
          :key="props.item.temporaryQuickCommand.id"
          class="room-call-tile__quick-command room-call-tile__quick-command--temporary"
        >
          <NmorphText as="small" :color="temporaryQuickCommandTextColor" variant="body-small">{{
            $t(temporaryQuickCommandI18n)
          }}</NmorphText>
        </div>
      </div>
    </div>
    <div
      v-if="isRoomCallTileRemoteActionsVisible"
      class="room-call-tile__remote-actions room-call-tile__overlay"
      @click.stop
    >
      <NmorphButton
        design="plain"
        thickness="thin"
        shape="circle"
        borderless
        :aria-label="remoteMuteButtonText"
        @click.stop="toggleRemoteAudioMuted"
      >
        <template #icon-only>
          <NmorphIcon>
            <NmorphIconMuteSpeaker v-if="isRemoteAudioMuted" />
            <NmorphIconSpeaker v-else />
          </NmorphIcon>
        </template>
      </NmorphButton>
      <NmorphButton
        design="plain"
        thickness="thin"
        shape="circle"
        borderless
        :aria-label="remoteHideButtonText"
        @click.stop="toggleRemoteVideoHidden"
      >
        <template #icon-only>
          <NmorphIcon>
            <NmorphIconEyeBlocked v-if="isRemoteVideoHidden" />
            <NmorphIconEye v-else />
          </NmorphIcon>
        </template>
      </NmorphButton>
    </div>
    <div
      v-if="props.item.connectionQuality"
      class="room-call-tile__connection-quality room-call-tile__overlay"
      :class="roomCallConnectionQualityClass"
      aria-hidden="true"
    >
      <span
        v-for="bar in roomCallConnectionQualityBarItems"
        :key="bar.level"
        class="room-call-tile__connection-quality-bar"
        :class="[
          `room-call-tile__connection-quality-bar--${bar.level}`,
          bar.active && 'room-call-tile__connection-quality-bar--active',
          bar.active && bar.reconnecting && 'room-call-tile__connection-quality-bar--reconnecting'
        ]"
      />
    </div>
  </div>
</template>

<style lang="scss">
.room-call-tile {
  cursor: pointer;

  position: relative;

  overflow: hidden;

  aspect-ratio: auto;
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 0;
  border-radius: 8px;

  background: var(--app-content-surface);
  box-shadow: none;
}

.room-call-tile {
  .nmorph-media-tile__name {
    display: none;
  }
}

.room-call-tile__media.nmorph-media-tile--plain {
  border: 0;
  background: var(--app-content-surface);
}

.room-call-tile__overlay {
  cursor: default;
  padding: 6px 8px;
  border-radius: 6px;
  background: var(--app-shadow-dark);
}

.room-call-tile__top {
  cursor: default;

  position: absolute;
  top: 8px;
  right: 8px;
  left: 8px;

  display: grid;
  gap: 4px;
  justify-items: start;
}

.room-call-tile__bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;

  box-sizing: border-box;
  width: 100%;
}

.room-call-tile__identity {
  display: flex;
  gap: 8px;
  align-items: center;
}

.room-call-tile__states {
  display: flex;
  gap: 6px;
  align-items: center;
}

.room-call-tile__state.room-call-tile__state--off {
  --nmorph-private-icon-color: var(--nmorph-error-text-color);
}

.room-call-tile__remote-actions {
  position: absolute;
  bottom: 8px;
  left: 8px;

  display: flex;
  gap: 4px;
  align-items: center;

  padding: 4px;
}

.room-call-tile__connection-quality {
  --room-call-tile-connection-quality-color: var(--nmorph-success-color);

  position: absolute;
  right: 8px;
  bottom: 8px;

  display: flex;
  gap: 2px;
  align-items: flex-end;

  padding: 5px 6px;
}

.room-call-tile__connection-quality--unstable {
  --room-call-tile-connection-quality-color: var(--nmorph-warn-color);
}

.room-call-tile__connection-quality--poor,
.room-call-tile__connection-quality--reconnecting {
  --room-call-tile-connection-quality-color: var(--nmorph-error-text-color);
}

.room-call-tile__connection-quality-bar {
  width: 3px;
  border-radius: 2px;
  opacity: 0.32;
  background: var(--nmorph-contrast-text-color);
}

.room-call-tile__connection-quality-bar--1 {
  height: 5px;
}

.room-call-tile__connection-quality-bar--2 {
  height: 9px;
}

.room-call-tile__connection-quality-bar--3 {
  height: 13px;
}

.room-call-tile__connection-quality-bar--active {
  opacity: 1;
  background: var(--room-call-tile-connection-quality-color);
}

.room-call-tile__connection-quality-bar--reconnecting {
  animation: room-call-tile-connection-quality-reconnecting 0.9s ease-in-out infinite;
}

.room-call-tile__quick-commands {
  pointer-events: none;

  display: grid;
  grid-template-rows: 28px max-content;
  gap: 4px;
  place-items: start start;
}

.room-call-tile__quick-command {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px 8px;
  border-radius: 6px;

  background: var(--app-shadow-dark);
}

.room-call-tile__quick-command--temporary {
  grid-row: 2;
  animation: room-call-tile-quick-command 0.18s ease;
}

.room-call-tile__quick-command--hand {
  grid-row: 1;
  min-width: 24px;
  min-height: 24px;
  padding: 6px;
}

@keyframes room-call-tile-quick-command {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes room-call-tile-connection-quality-reconnecting {
  0%,
  100% {
    opacity: 0.35;
  }

  50% {
    opacity: 1;
  }
}
</style>
