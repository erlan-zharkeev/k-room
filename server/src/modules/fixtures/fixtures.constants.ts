import keyBy from 'lodash/keyBy'

import type { FixtureContactData, FixtureGroupData, FixtureMessageData, FixtureUserData } from './fixtures.types'

const FIXTURE_PASSWORD = 'Asdf1234'
export const FIXTURE_USER_ONBOARDING = {
  welcomeCompleted: true,
  guideCompleted: true
} as const

const FIXTURE_USERS = [
  {
    nickname: 'ethan',
    avatarId: '68f100000000000000000001',
    avatarPath: 'ethan.png'
  },
  {
    nickname: 'olivia',
    avatarId: '68f100000000000000000002',
    avatarPath: 'olivia.png'
  },
  {
    nickname: 'maya',
    avatarId: '68f100000000000000000003',
    avatarPath: 'maya.png'
  },
  {
    nickname: 'noah',
    avatarId: '68f100000000000000000004',
    avatarPath: 'noah.png'
  },
  {
    nickname: 'lucas',
    avatarId: '68f100000000000000000005',
    avatarPath: 'lucas.png'
  },
  {
    id: '68f100000000000000000007',
    nickname: 'alex',
    avatarId: '68f100000000000000000007',
    avatarPath: 'ethan.png'
  },
  {
    id: '68f100000000000000000008',
    nickname: 'sam',
    avatarId: '68f100000000000000000008',
    avatarPath: 'olivia.png'
  }
] as const

const buildFixtureId = (index: number) =>
  (BigInt('0x68a09410778b70d522ea8fa0') + BigInt(index)).toString(16).padStart(24, '0')

export const BASE_FIXTURE_TIMESTAMP_MS = Date.UTC(2026, 5, 12, 15, 0, 0)
export const USER_FIXTURES = FIXTURE_USERS.map((user, index) => {
  const { nickname, avatarId, avatarPath } = user

  return {
    id: 'id' in user ? user.id : buildFixtureId(index),
    email: `${nickname.toLowerCase()}@gmail.com`,
    nickname,
    pass: FIXTURE_PASSWORD,
    avatarId,
    avatarPath
  }
}) satisfies FixtureUserData[]
export const PRIMARY_FIXTURE_USERNAMES = {
  ethan: 'ethan',
  olivia: 'olivia',
  maya: 'maya',
  noah: 'noah',
  lucas: 'lucas'
} as const
export const PRIMARY_FIXTURE_NICKNAME = PRIMARY_FIXTURE_USERNAMES.ethan
export const DIRECT_FIXTURE_CONTACT_NICKNAME = PRIMARY_FIXTURE_USERNAMES.olivia
export const SECONDARY_DIRECT_FIXTURE_CONTACT_NICKNAME = PRIMARY_FIXTURE_USERNAMES.maya
export const TERTIARY_DIRECT_FIXTURE_CONTACT_NICKNAME = PRIMARY_FIXTURE_USERNAMES.noah
export const QUATERNARY_DIRECT_FIXTURE_CONTACT_NICKNAME = PRIMARY_FIXTURE_USERNAMES.lucas
export const PRODUCT_STUDIO_FIXTURE_GROUP_KEY = 'product-studio'
export const WEEKEND_HOUSE_FIXTURE_GROUP_KEY = 'weekend-house'
export const FIXTURE_GROUPS = [
  {
    key: PRODUCT_STUDIO_FIXTURE_GROUP_KEY,
    adminNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    chatName: 'Product Studio',
    avatarId: '68f100000000000000000006',
    avatarPath: 'product-studio.png',
    nicknames: [
      PRIMARY_FIXTURE_USERNAMES.ethan,
      PRIMARY_FIXTURE_USERNAMES.olivia,
      PRIMARY_FIXTURE_USERNAMES.maya,
      PRIMARY_FIXTURE_USERNAMES.noah
    ]
  },
  {
    key: WEEKEND_HOUSE_FIXTURE_GROUP_KEY,
    adminNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    chatName: 'Weekend House',
    avatarId: '68f100000000000000000007',
    avatarPath: 'weekend-house.png',
    nicknames: [
      PRIMARY_FIXTURE_USERNAMES.ethan,
      PRIMARY_FIXTURE_USERNAMES.olivia,
      PRIMARY_FIXTURE_USERNAMES.maya,
      PRIMARY_FIXTURE_USERNAMES.lucas
    ]
  }
] as const satisfies readonly FixtureGroupData[]
export const DIRECT_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-ethan-olivia'
export const SECONDARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-ethan-maya'
export const TERTIARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-ethan-noah'
export const QUATERNARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-ethan-lucas'
export const PRODUCT_STUDIO_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-product-studio'
export const WEEKEND_HOUSE_FIXTURE_MESSAGE_ID_PREFIX = 'fixture-weekend-house'
export const DIRECT_FIXTURE_CREATED_AT_OFFSET_MS = 0
export const SECONDARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS = 2 * 60 * 60 * 1_000
export const TERTIARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS = 3 * 60 * 60 * 1_000
export const PRODUCT_STUDIO_FIXTURE_CREATED_AT_OFFSET_MS = 4 * 60 * 60 * 1_000
export const QUATERNARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS = 5 * 60 * 60 * 1_000
export const WEEKEND_HOUSE_FIXTURE_CREATED_AT_OFFSET_MS = 6 * 60 * 60 * 1_000
const buildLegacyFixtureId = (index: number) =>
  (BigInt('0x68a09410778b70d522ea8fa0') + BigInt(index)).toString(16).padStart(24, '0')

export const LEGACY_FIXTURE_USER_IDS = Array.from({ length: 28 }, (_, index) => buildLegacyFixtureId(index + 5))
export const LEGACY_FIXTURE_ROOM_CHAT_NAMES = [
  'Frontend Core',
  'Weekend Plans',
  'Design Review',
  'Admin Leave Test Alpha',
  'Admin Leave Test Beta'
] as const
export const LEGACY_FIXTURE_EMPTY_ROOM_CHAT_NAME_PATTERN = /^Empty Room \d+$/
export const LEGACY_FIXTURE_MESSAGE_ID_PATTERN = /^fixture-(erlan-tolik|frontend-core|long-private)-/
export const FIXTURE_MESSAGE_IMAGE_FILES = [
  {
    id: '68f000000000000000000001',
    path: 'ethan.png'
  },
  {
    id: '68f000000000000000000002',
    path: 'olivia.png'
  },
  {
    id: '68f000000000000000000003',
    path: 'maya.png'
  },
  {
    id: '68f000000000000000000004',
    path: 'noah.png'
  },
  {
    id: '68f000000000000000000005',
    path: 'lucas.png'
  }
] as const

export const FIXTURE_CONTACTS = [
  {
    nickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    interaction: 'invite-accepted',
    reverseInteraction: 'invite-accepted'
  },
  {
    nickname: PRIMARY_FIXTURE_USERNAMES.maya,
    interaction: 'invite-accepted',
    reverseInteraction: 'invite-accepted'
  },
  {
    nickname: PRIMARY_FIXTURE_USERNAMES.noah,
    interaction: 'invite-accepted',
    reverseInteraction: 'invite-accepted'
  },
  {
    nickname: PRIMARY_FIXTURE_USERNAMES.lucas,
    interaction: 'invite-accepted',
    reverseInteraction: 'invite-accepted'
  }
] as const satisfies FixtureContactData[]

export const DIRECT_FIXTURE_MESSAGES = [
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Morning olivia. I tightened the onboarding flow and left the guide open so we can capture it from a clean first-run state.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Great. The first screen already feels more welcoming. I would keep the copy short and let the highlighted areas do most of the work.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.ethan,
        glyphKey: '\u{1F44D}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Agreed. I also want the chat list to look like real product usage instead of a database stress test.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Then we should use names, avatars, and conversations that feel like a small team actually shipped something today.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Exactly. I will keep two group rooms visible: one work room and one casual room. That should make the navigation screenshots much easier to read.',
    imageIds: [],
    reactions: [],
    replyToIndex: 4
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'I added the latest profile shots here so we can verify image bubbles, rounded corners, and the gallery layout in the same pass.',
    imageIds: [FIXTURE_MESSAGE_IMAGE_FILES[1].id, FIXTURE_MESSAGE_IMAGE_FILES[2].id],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.ethan,
        glyphKey: '\u{1F440}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'These look clean. I will use this conversation for the message deletion and reply states because the spacing is realistic.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Perfect. After that, let us grab desktop and mobile screenshots before we touch the server-side guide progress.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.ethan,
        glyphKey: '\u{2728}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'One more detail: the empty background should never flash between routes. I want the guide captures to feel calm.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Yes. Calm is the right word. The app is dark and dense, so every transition needs to feel intentional.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'I will run through the first-login path again after fixtures reload. If anything still looks synthetic, we can tune the copy.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Sounds good. Send me the final screenshots when the guide sits correctly next to each highlighted block.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  }
] as const satisfies readonly FixtureMessageData[]

export const SECONDARY_DIRECT_FIXTURE_MESSAGES = [
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'Hey ethan, I reviewed the settings page. The FAQ button for reopening the guide is in the right place.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Nice. I want new users to discover it naturally, but still have a clear way back to it later.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'Then keep the label direct. "Show guide" is enough. No extra helper text needed.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.ethan,
        glyphKey: '\u{1F4AF}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Good call. The guide already explains itself once it opens.',
    imageIds: [],
    reactions: [],
    replyToIndex: 3
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'Also, the success outline around the target block reads well. It draws attention without covering the interface.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'That was the goal. It should look like the app is helping, not like a modal is fighting the layout.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'I will check the narrow viewport next. The tooltip should stay attached to the target, not the screen edge.',
    imageIds: [FIXTURE_MESSAGE_IMAGE_FILES[2].id],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Thanks. If mobile looks right, the guide is ready for the server progress flag.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  }
] as const satisfies readonly FixtureMessageData[]

export const TERTIARY_DIRECT_FIXTURE_MESSAGES = [
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.noah,
    body: 'Hey ethan, I checked the call screen after the route animation changes. The canvas background stays stable now.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Good. That was the one part I did not want showing up in onboarding screenshots.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.noah,
    body: 'The call list also feels lighter with real names. It is much easier to judge spacing when the data looks natural.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.ethan,
        glyphKey: '\u{1F44D}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Exactly. I want every screen in the guide to feel like a real workspace, not a fixture dump.',
    imageIds: [],
    reactions: [],
    replyToIndex: 3
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.noah,
    body: 'I will keep testing the call controls on desktop. The active state should be obvious without shouting.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Thanks. Once calls look clean, the guide can point there without extra explanation.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  }
] as const satisfies readonly FixtureMessageData[]

export const QUATERNARY_DIRECT_FIXTURE_MESSAGES = [
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.lucas,
    body: 'I went through the contact screen. The accepted contacts look good, but the list needed one more real conversation.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Perfect timing. I am adding direct chats for everyone so screenshots do not make half the contacts look inactive.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.lucas,
    body: 'That will help. A quiet contact list is fine, but it should still feel like people actually use the app.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.ethan,
        glyphKey: '\u{2728}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Agreed. I will keep the copy short and use the weekend group for the more casual preview.',
    imageIds: [],
    reactions: [],
    replyToIndex: 3
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.lucas,
    body: 'Nice. I can review the final mobile screenshots after the seed reloads.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Deal. I will ping you once the fixture chats are in place.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  }
] as const satisfies readonly FixtureMessageData[]

export const PRODUCT_STUDIO_FIXTURE_MESSAGES = [
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'I replaced the demo rooms with a smaller set of realistic chats. The left navigation should look much cleaner now.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.noah,
    body: 'Excellent. The old empty rooms made every screenshot feel like a load test.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.olivia,
        glyphKey: '\u{1F44D}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'Can we keep one image-heavy message in the room? It helps check the gallery spacing against the chat background.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'Yes. I added a two-image message in the direct chat and a single image here for the group layout.',
    imageIds: [FIXTURE_MESSAGE_IMAGE_FILES[3].id],
    reactions: [],
    replyToIndex: 3
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'The group header also needs a proper avatar. A real image there makes the top bar feel finished.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.noah,
    body: 'I am checking unread badges now. The values are high enough to test the chip, but not so high that the list looks broken.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'That balance matters. We need realistic density, not every edge case on the first screen.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.maya,
        glyphKey: '\u{2728}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'The contact list should also be calmer now: no blocked users, no max-length names, and no placeholder avatars.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Good. For onboarding screenshots, the product should look like it already has a small real team inside.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.noah,
    body: 'I will take the wide layout screenshots after the fixtures reload.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'I will handle the mobile set. The guide placement is easier to judge with natural data in the list.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'Great. Once we have both, we can decide which images belong inside each guide step.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  }
] as const satisfies readonly FixtureMessageData[]

export const WEEKEND_HOUSE_FIXTURE_MESSAGES = [
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.lucas,
    body: 'Quick weekend check: are we still aiming for Saturday morning?',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Yes. I can pick up coffee and breakfast on the way out.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.maya,
        glyphKey: '\u{1F44D}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'I will bring the camera. We can use a few natural shots for the next round of interface previews.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'Love that. The app looks better when the media feels personal instead of stock.',
    imageIds: [],
    reactions: [],
    replyToIndex: 3
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.lucas,
    body: 'I booked the place until Sunday evening, so no rush after lunch.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Nice. I added everyone to the shared list. Snacks, chargers, and board games are covered.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.ethan,
    body: 'I uploaded the last portrait here too, just to make sure group media preview works with a casual chat.',
    imageIds: [FIXTURE_MESSAGE_IMAGE_FILES[4].id],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.maya,
    body: 'Looks good on my side. The image sits nicely against the dark background.',
    imageIds: [],
    reactions: [
      {
        nickname: PRIMARY_FIXTURE_USERNAMES.ethan,
        glyphKey: '\u{2728}'
      }
    ],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.lucas,
    body: 'I will share the address tonight. See you all Saturday.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  },
  {
    authorNickname: PRIMARY_FIXTURE_USERNAMES.olivia,
    body: 'Perfect. I will keep notifications on so nobody misses the final details.',
    imageIds: [],
    reactions: [],
    replyToIndex: null
  }
] as const satisfies readonly FixtureMessageData[]

export const USER_BY_NICKNAME = keyBy(USER_FIXTURES, 'nickname')
export const PRIMARY_FIXTURE_USER_ID = USER_BY_NICKNAME[PRIMARY_FIXTURE_NICKNAME]!.id
export const DIRECT_FIXTURE_CONTACT_USER_ID = USER_BY_NICKNAME[DIRECT_FIXTURE_CONTACT_NICKNAME]!.id
export const SECONDARY_DIRECT_FIXTURE_CONTACT_USER_ID = USER_BY_NICKNAME[SECONDARY_DIRECT_FIXTURE_CONTACT_NICKNAME]!.id
export const TERTIARY_DIRECT_FIXTURE_CONTACT_USER_ID = USER_BY_NICKNAME[TERTIARY_DIRECT_FIXTURE_CONTACT_NICKNAME]!.id
export const QUATERNARY_DIRECT_FIXTURE_CONTACT_USER_ID =
  USER_BY_NICKNAME[QUATERNARY_DIRECT_FIXTURE_CONTACT_NICKNAME]!.id
