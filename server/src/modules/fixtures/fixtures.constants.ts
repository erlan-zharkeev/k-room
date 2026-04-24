export const DAY_IN_MS = 1000 * 60 * 60 * 24
export const MINUTE_IN_MS = 1000 * 60
export const BASE_FIXTURE_TIMESTAMP = Date.UTC(2026, 1, 1, 8, 0, 0)
export const CONTACT_INTERACTION = 'invite-accepted'
export const MESSAGE_SUBJECTS = [
  'search contacts',
  'socket reconnect flow',
  'message pagination',
  'chat room sorting',
  'device permissions',
  'notification center',
  'group room updates',
  'image upload flow',
  'scroll restoration',
  'profile editing'
] as const
export const MESSAGE_ACTIONS = [
  'looks stable after the last patch',
  'still needs a regression check',
  'started behaving better in Chromium',
  'shows the edge case more clearly now',
  'needs cleaner empty-state handling',
  'benefits from stronger typing',
  'should be covered by a smoke test',
  'would be easier to inspect with better fixtures',
  'is ready for another review pass',
  'should be rechecked after deploy'
] as const
export const MESSAGE_QUALIFIERS = [
  'before lunch',
  'after the nightly restart',
  'when the room is reopened',
  'on a fresh session',
  'after clearing the cache',
  'while testing on mobile width',
  'with multiple rooms selected in sequence',
  'after a silent token refresh',
  'when the modal is opened twice',
  'while the websocket reconnects'
] as const
