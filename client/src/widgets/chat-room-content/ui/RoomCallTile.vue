<script setup lang="ts">
import {
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
import { AppText } from 'src/shared/ui'

import { ROOM_CALL_TILE_STATE_ICON_SIZE } from '../config/constants'
import type { RoomCallTileEmits, RoomCallTileProps } from '../config/types'
import { useRoomCallTile } from '../model/use-room-call-tile.model'

const props = defineProps<RoomCallTileProps>()
const emit = defineEmits<RoomCallTileEmits>()
const {
  avatarImageSrc,
  isMediaTileVideoOff,
  isRemoteAudioMuted,
  isRemoteVideoHidden,
  remoteHideButtonText,
  remoteMuteButtonText,
  roomCallTileAudioVolumeDb,
  temporaryQuickCommandI18n,
  temporaryQuickCommandTextColor,
  toggleRemoteAudioMuted,
  toggleRemoteVideoHidden
} = useRoomCallTile(props)
</script>

<template>
  <div class="room-call-tile" @click="emit('select')">
    <NmorphMediaTile
      v-if="props.self"
      class="room-call-tile__media"
      :src-object="props.item.stream"
      :name="props.item.name"
      :avatar-src="avatarImageSrc"
      :mirrored="props.item.mirrored"
      :muted="props.item.isLocal || isRemoteAudioMuted"
      :video-off="isMediaTileVideoOff"
      :show-status="false"
    />
    <NmorphMediaTile
      v-if="!props.self"
      class="room-call-tile__media"
      :src-object="props.item.stream"
      :name="props.item.name"
      :avatar-src="avatarImageSrc"
      :mirrored="props.item.mirrored"
      :muted="isRemoteAudioMuted"
      :video-off="isMediaTileVideoOff"
      :show-status="false"
    />
    <div class="room-call-tile__top" @click.stop>
      <div class="room-call-tile__bar room-call-tile__overlay">
        <div class="room-call-tile__identity">
          <AppText
            class="room-call-tile__name"
            tag="small"
            color="contrast-text"
            truncate
            :selectable="false"
            :text="props.item.name"
          />
          <NmorphAudioMeter
            class="room-call-tile__audio-meter"
            :label="props.item.name"
            :volume-db="roomCallTileAudioVolumeDb"
            :bars="5"
          />
        </div>
        <div class="room-call-tile__states">
          <NmorphIcon
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
      <div v-if="props.item.isHandRaised || props.item.temporaryQuickCommand" class="room-call-tile__quick-commands">
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
          <AppText
            tag="small"
            :color="temporaryQuickCommandTextColor"
            :selectable="false"
            :text="$t(temporaryQuickCommandI18n)"
          />
        </div>
      </div>
    </div>
    <div v-if="!props.self" class="room-call-tile__remote-actions room-call-tile__overlay" @click.stop>
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
  </div>
</template>

<style lang="scss">
.room-call-tile {
  cursor: pointer;

  position: relative;

  overflow: hidden;

  aspect-ratio: auto;
  min-width: 0;
  height: 100%;
  min-height: 0;
  border-radius: 8px;

  background: var(--app-message-surface);
  box-shadow: none;
}

.room-call-tile {
  .nmorph-media-tile__name {
    display: none;
  }
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
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;

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

.room-call-tile__quick-commands {
  pointer-events: none;

  display: grid;
  grid-template-rows: 28px max-content;
  gap: 4px;
  align-items: start;
  justify-items: start;
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
</style>
