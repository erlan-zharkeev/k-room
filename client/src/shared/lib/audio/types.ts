import type { APP_SOUND_KIND } from './constants'

export type AppSoundKind = (typeof APP_SOUND_KIND)[keyof typeof APP_SOUND_KIND]
