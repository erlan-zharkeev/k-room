import type { AppMediaTileProps } from './types'

export const APP_MEDIA_TILE_DEFAULT_PROPS = {
  avatarSrc: '',
  mirrored: false,
  name: '',
  screenSharing: false,
  stream: null,
  videoOff: false
} satisfies Required<AppMediaTileProps>
