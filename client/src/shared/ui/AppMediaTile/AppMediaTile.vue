<script setup lang="ts">
import { NmorphAvatar } from '@nmorph/nmorph-ui-kit'

import { APP_MEDIA_TILE_DEFAULT_PROPS } from './constants'
import type { AppMediaTileProps } from './types'
import { useAppMediaTile } from './use-app-media-tile.model'

const props = withDefaults(defineProps<AppMediaTileProps>(), APP_MEDIA_TILE_DEFAULT_PROPS)
const { appMediaTileClass, appMediaTileFallbackLabel, isAppMediaTileFallbackVisible, isAppMediaTileVideoVisible } =
  useAppMediaTile(props)
</script>

<template>
  <div class="app-media-tile" :class="appMediaTileClass">
    <video v-show="isAppMediaTileVideoVisible" ref="video" class="app-media-tile__video" muted autoplay playsinline />
    <div v-if="isAppMediaTileFallbackVisible" class="app-media-tile__fallback">
      <NmorphAvatar v-if="props.avatarSrc" :src="props.avatarSrc" :name="props.name" :size="72" design="plain" />
      <div v-else class="app-media-tile__initials">{{ appMediaTileFallbackLabel }}</div>
      <span v-if="props.name" class="app-media-tile__name">{{ props.name }}</span>
    </div>
    <slot name="overlay" />
  </div>
</template>

<style lang="scss" scoped>
.app-media-tile {
  position: relative;

  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  aspect-ratio: 16 / 9;
  width: 100%;
  min-width: 0;
  border: var(--nmorph-plain-border);
  border-radius: var(--default-border-radius);

  background: var(--nmorph-main-color);
  box-shadow: none;
}

.app-media-tile__video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-media-tile--mirrored .app-media-tile__video {
  transform: scaleX(-1);
}

.app-media-tile__fallback {
  display: flex;
  flex-direction: column;
  gap: var(--indentation-02);
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: var(--indentation-04);

  color: var(--nmorph-text-color);
  text-align: center;
}

.app-media-tile__initials {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 72px;
  height: 72px;
  border-radius: var(--border-radius-circular);

  font-size: var(--nmorph-typography-title-large-font-size);
  font-weight: var(--font-weight-bold);
  color: var(--nmorph-focus-text-color);

  background: var(--nmorph-accent-color);
}

.app-media-tile__name {
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-media-tile--screen-sharing {
  box-shadow: 0 0 0 2px var(--nmorph-success-text-color);
}
</style>
