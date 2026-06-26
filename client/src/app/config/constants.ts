export const MIN_APP_VIEWPORT_WIDTH_PX = 320
export const MIN_APP_VIEWPORT_HEIGHT_PX = 350
export const INTERACTION_EVENTS = ['click', 'pointerdown', 'keydown'] as const
export const NATIVE_DESKTOP_CACHE_CLEANUP_STORAGE_PREFIX = 'k-room:native-cache-cleaned:'
export const NATIVE_DESKTOP_CHUNK_RECOVERY_STORAGE_PREFIX = 'k-room:native-chunk-recovery:'
export const DYNAMIC_IMPORT_ERROR_MESSAGES = [
  'failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'importing a module script failed'
] as const
