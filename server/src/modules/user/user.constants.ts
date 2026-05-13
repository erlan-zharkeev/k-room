import { USER_NICKNAME_MAX_LENGTH } from 'global-shared'

const FIXTURE_PASSWORD = 'Asdf1234'
const FIXTURE_AVATAR_PATHS = [
  'src/modules/fixtures/images/erlan.jpg',
  'src/modules/fixtures/images/tolik.jpg',
  'src/modules/fixtures/images/guest.jpg'
] as const
const createMaxLengthFixtureNickname = (prefix: string) => prefix.padEnd(USER_NICKNAME_MAX_LENGTH, '0')

export const FIXTURE_MAX_LENGTH_NICKNAMES = {
  alina: createMaxLengthFixtureNickname('alina-max-nickname-'),
  misha: createMaxLengthFixtureNickname('misha-max-nickname-'),
  dasha: createMaxLengthFixtureNickname('dasha-max-nickname-'),
  roma: createMaxLengthFixtureNickname('roma-max-nickname-')
} as const
const FIXTURE_USERNAMES = [
  'erlan',
  'tolik',
  'guest',
  FIXTURE_MAX_LENGTH_NICKNAMES.alina,
  FIXTURE_MAX_LENGTH_NICKNAMES.misha,
  FIXTURE_MAX_LENGTH_NICKNAMES.dasha,
  FIXTURE_MAX_LENGTH_NICKNAMES.roma,
  'nina',
  'mark',
  'lena',
  'denis',
  'sofia',
  'pavel',
  'marta',
  'yarik',
  'vika',
  'artem',
  'katya',
  'sergey',
  'olya',
  'timur',
  'yana',
  'nikita',
  'sveta',
  'ilya',
  'mila',
  'andrey',
  'arina',
  'kostya',
  'zoya',
  'vadim',
  'rita',
  'lev'
] as const

const buildFixtureId = (index: number) =>
  (BigInt('0x68a09410778b70d522ea8fa0') + BigInt(index)).toString(16).padStart(24, '0')

export const ALLOWED_GOOGLE_AVATAR_HOSTS = ['lh3.googleusercontent.com']
export const LAST_SEEN_PATH = 'public.lastSeen'
export const USER_FIXTURES = FIXTURE_USERNAMES.map((nickname, index) => ({
  id: buildFixtureId(index),
  email: `${nickname}@gmail.com`,
  nickname,
  pass: FIXTURE_PASSWORD,
  avatarPath: FIXTURE_AVATAR_PATHS[index % FIXTURE_AVATAR_PATHS.length]
}))
export const PRIMARY_FIXTURE_USERNAMES = {
  erlan: 'erlan',
  tolik: 'tolik',
  guest: 'guest'
} as const
export const FIXTURE_GROUPS = [
  {
    key: 'frontend-core',
    authorNickname: 'erlan',
    chatName: 'Frontend Core',
    nicknames: [
      'erlan',
      'tolik',
      FIXTURE_MAX_LENGTH_NICKNAMES.alina,
      FIXTURE_MAX_LENGTH_NICKNAMES.misha,
      FIXTURE_MAX_LENGTH_NICKNAMES.dasha
    ]
  },
  {
    key: 'weekend-plans',
    authorNickname: 'tolik',
    chatName: 'Weekend Plans',
    nicknames: ['erlan', 'tolik', FIXTURE_MAX_LENGTH_NICKNAMES.roma, 'nina', 'mark', 'lena']
  },
  {
    key: 'design-review',
    authorNickname: 'guest',
    chatName: 'Design Review',
    nicknames: ['erlan', 'guest', 'sofia', 'marta', 'vika']
  }
] as const
export const FIXTURE_MESSAGE_COUNT = 101
