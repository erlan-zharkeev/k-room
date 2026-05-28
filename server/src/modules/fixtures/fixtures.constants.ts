import { CONTACT_INTERACTION, DAY_IN_MS } from 'global-shared'
import keyBy from 'lodash/keyBy'

import { FIXTURE_MAX_LENGTH_NICKNAMES, USER_FIXTURES } from '../user/user.constants'

import type { FixtureContactData } from './fixtures.types'

export const BASE_FIXTURE_TIMESTAMP_MS = Date.UTC(2026, 1, 1, 8, 0, 0)
export const DIRECT_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-erlan-tolik'
export const FRONTEND_CORE_FIXTURE_GROUP_KEY = 'frontend-core'
export const FRONTEND_CORE_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-frontend-core'
export const FRONTEND_CORE_SELF_PHOTO_MESSAGE_INDEX = 103
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
    id: '68f000000000000000000001',
    path: 'src/modules/fixtures/images/tolik.jpg'
  },
  {
    id: '68f000000000000000000002',
    path: 'src/modules/fixtures/images/guest.jpg'
  },
  {
    id: '68f000000000000000000003',
    path: 'src/modules/fixtures/images/erlan.jpg'
  },
  {
    id: '68f000000000000000000004',
    path: 'src/modules/fixtures/images/tolik.jpg'
  },
  {
    id: '68f000000000000000000005',
    path: 'src/modules/fixtures/images/guest.jpg'
  }
] as const
export const FIXTURE_TOLIK_MESSAGE_IMAGES_BY_INDEX: Record<number, readonly string[]> = {
  96: [FIXTURE_MESSAGE_IMAGE_FILES[0].id],
  100: FIXTURE_MESSAGE_IMAGE_FILES.map(({ id }) => id)
}
const FIXTURE_REACTION_STRESS_GLYPH_KEYS = [
  '\u{1F44D}',
  '\u{1F525}',
  '\u{1F440}',
  '\u{1F600}',
  '\u{1F604}',
  '\u{1F60E}',
  '\u{1F914}',
  '\u{1F389}',
  '\u{1F680}',
  '\u{2728}',
  '\u{1F4AF}',
  '\u{1F64C}',
  '\u{1F44F}',
  '\u{1F9E0}',
  '\u{1F4A1}',
  '\u{1F6E0}',
  '\u{1F9EA}',
  '\u{1F4CC}',
  '\u{1F4CE}',
  '\u{1F4F8}',
  '\u{1F3AF}',
  '\u{1F4A5}',
  '\u{1F48E}',
  '\u{1F9CA}',
  '\u{1F331}',
  '\u{1F4AC}',
  '\u{1F4DD}',
  '\u{1F50D}',
  '\u{1F511}',
  '\u{1F512}',
  '\u{1F9F2}',
  '\u{1F9ED}',
  '\u{1F9F9}'
] as const
const FIXTURE_REACTION_STRESS_OFFSETS = [0, 1, 2] as const
const FIXTURE_REACTION_STRESS_NICKNAMES = USER_FIXTURES.map(({ nickname }) => nickname)
const FIXTURE_WIDE_REACTIONS = FIXTURE_REACTION_STRESS_NICKNAMES.map((nickname, index) => ({
  nickname,
  glyphKey: FIXTURE_REACTION_STRESS_GLYPH_KEYS[index]
}))
const FIXTURE_DENSE_REACTIONS = FIXTURE_REACTION_STRESS_NICKNAMES.flatMap((nickname, index) =>
  FIXTURE_REACTION_STRESS_OFFSETS.map((offset) => ({
    nickname,
    glyphKey: FIXTURE_REACTION_STRESS_GLYPH_KEYS[(index + offset) % FIXTURE_REACTION_STRESS_GLYPH_KEYS.length]
  }))
)
export const FIXTURE_MESSAGE_REACTIONS_BY_INDEX: Record<number, readonly { nickname: string; glyphKey: string }[]> = {
  88: FIXTURE_WIDE_REACTIONS,
  89: FIXTURE_DENSE_REACTIONS,
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
    interaction: CONTACT_INTERACTION.INVITE_ACCEPTED,
    reverseInteraction: CONTACT_INTERACTION.INVITE_ACCEPTED
  },
  {
    nickname: 'guest',
    interaction: CONTACT_INTERACTION.DEFAULT
  },
  {
    nickname: FIXTURE_MAX_LENGTH_NICKNAMES.alina,
    interaction: CONTACT_INTERACTION.INVITED,
    reverseInteraction: CONTACT_INTERACTION.INVITE_RECEIVED
  },
  {
    nickname: FIXTURE_MAX_LENGTH_NICKNAMES.misha,
    interaction: CONTACT_INTERACTION.INVITE_RECEIVED,
    reverseInteraction: CONTACT_INTERACTION.INVITED
  },
  {
    nickname: FIXTURE_MAX_LENGTH_NICKNAMES.dasha,
    interaction: CONTACT_INTERACTION.BLOCKED
  },
  {
    nickname: FIXTURE_MAX_LENGTH_NICKNAMES.roma,
    interaction: CONTACT_INTERACTION.INVITE_ACCEPTED,
    reverseInteraction: CONTACT_INTERACTION.INVITE_ACCEPTED
  },
  {
    nickname: 'nina',
    interaction: CONTACT_INTERACTION.INVITED,
    reverseInteraction: CONTACT_INTERACTION.INVITE_RECEIVED
  },
  {
    nickname: 'mark',
    interaction: CONTACT_INTERACTION.BLOCKED
  }
] as const satisfies FixtureContactData[]
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
export const USER_BY_NICKNAME = keyBy(USER_FIXTURES, 'nickname')
export const ERLAN_ID = USER_BY_NICKNAME.erlan?.id ?? ''
export const TOLIK_ID = USER_BY_NICKNAME.tolik?.id ?? ''
