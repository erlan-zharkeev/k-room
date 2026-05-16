import { FIXTURE_MAX_LENGTH_NICKNAMES } from '../user/user.constants'

import type { IFixtureContactData } from './fixtures.types'

export const DAY_IN_MS = 1000 * 60 * 60 * 24
export const MINUTE_IN_MS = 1000 * 60
export const BASE_FIXTURE_TIMESTAMP_MS = Date.UTC(2026, 1, 1, 8, 0, 0)
export const DIRECT_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-erlan-tolik'
export const FRONTEND_CORE_FIXTURE_GROUP_KEY = 'frontend-core'
export const FRONTEND_CORE_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-frontend-core'
export const LONG_PRIVATE_FIXTURE_CONTACT_NICKNAME = FIXTURE_MAX_LENGTH_NICKNAMES.roma
export const LONG_PRIVATE_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-long-private'
export const LONG_PRIVATE_FIXTURE_MESSAGE_COUNT = 14
export const LONG_PRIVATE_FIXTURE_CREATED_AT_OFFSET_MS = 14 * DAY_IN_MS
export const LONG_PRIVATE_FIXTURE_MESSAGE_BODY =
  'Unread private fixture message for checking chat list title truncation next to the unread tag.'
export const FIXTURE_SENDING_MESSAGE_INDEX = 102
export const FIXTURE_REPLIED_MESSAGE_INDEX = 100
export const FIXTURE_REPLY_TARGET_MESSAGE_INDEX = 96
export const FIXTURE_LONG_REPLIED_MESSAGE_BODY =
  'Reply preview stress case: this quoted message is intentionally long so the chat bubble can show how replied content behaves with wrapping, spacing, contrast, and overflow in the compact message layout across desktop and mobile widths. It should remain readable without breaking the bubble geometry or footer alignment.'
export const FIXTURE_MESSAGE_IMAGE_FILES = [
  {
    filename: 'image.fixture-tolik-room-snapshot',
    path: 'src/modules/fixtures/images/tolik.jpg'
  },
  {
    filename: 'image.fixture-tolik-review-reference',
    path: 'src/modules/fixtures/images/guest.jpg'
  },
  {
    filename: 'image.fixture-tolik-erlan-reference',
    path: 'src/modules/fixtures/images/erlan.jpg'
  },
  {
    filename: 'image.fixture-tolik-second-snapshot',
    path: 'src/modules/fixtures/images/tolik.jpg'
  },
  {
    filename: 'image.fixture-tolik-second-reference',
    path: 'src/modules/fixtures/images/guest.jpg'
  }
] as const
export const FIXTURE_TOLIK_MESSAGE_IMAGES_BY_INDEX: Record<number, readonly string[]> = {
  96: [FIXTURE_MESSAGE_IMAGE_FILES[0].filename],
  100: FIXTURE_MESSAGE_IMAGE_FILES.map(({ filename }) => filename)
}
export const FIXTURE_MESSAGE_REACTIONS_BY_INDEX: Record<number, readonly { nickname: string; glyphKey: string }[]> = {
  92: [
    { nickname: 'erlan', glyphKey: '\u{1F44D}' },
    { nickname: 'tolik', glyphKey: '\u{1F44D}' }
  ],
  96: [
    { nickname: 'erlan', glyphKey: '\u{1F525}' },
    { nickname: 'tolik', glyphKey: '\u{1F525}' }
  ],
  100: [
    { nickname: 'erlan', glyphKey: '\u{1F440}' },
    { nickname: 'tolik', glyphKey: '\u{1F44D}' },
    { nickname: FIXTURE_MAX_LENGTH_NICKNAMES.alina, glyphKey: '\u{1F525}' }
  ]
} as const
export const FIXTURE_CONTACTS = [
  {
    nickname: 'tolik',
    interaction: 'invite-accepted',
    reverseInteraction: 'invite-accepted'
  },
  {
    nickname: 'guest',
    interaction: 'default'
  },
  {
    nickname: FIXTURE_MAX_LENGTH_NICKNAMES.alina,
    interaction: 'invited',
    reverseInteraction: 'invite-received'
  },
  {
    nickname: FIXTURE_MAX_LENGTH_NICKNAMES.misha,
    interaction: 'invite-received',
    reverseInteraction: 'invited'
  },
  {
    nickname: FIXTURE_MAX_LENGTH_NICKNAMES.dasha,
    interaction: 'blocked'
  },
  {
    nickname: FIXTURE_MAX_LENGTH_NICKNAMES.roma,
    interaction: 'invite-accepted',
    reverseInteraction: 'invite-accepted'
  },
  {
    nickname: 'nina',
    interaction: 'invited',
    reverseInteraction: 'invite-received'
  },
  {
    nickname: 'mark',
    interaction: 'blocked'
  }
] as const satisfies IFixtureContactData[]
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
