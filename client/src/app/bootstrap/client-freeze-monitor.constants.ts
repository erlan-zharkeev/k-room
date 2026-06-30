export const CLIENT_FREEZE_LONG_TASK_MIN_DURATION_MS = 500
export const CLIENT_FREEZE_INPUT_DELAY_MIN_DURATION_MS = 300
export const CLIENT_FREEZE_CAPTURE_COOLDOWN_MS = 60_000
export const CLIENT_FREEZE_INPUT_EVENTS = ['pointerdown', 'touchstart', 'click', 'keydown'] as const
export const CLIENT_FREEZE_SENTRY_CATEGORY = 'client.freeze'
export const CLIENT_FREEZE_SENTRY_MESSAGE = 'Client UI freeze detected'
