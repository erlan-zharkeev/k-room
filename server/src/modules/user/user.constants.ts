const FIXTURE_PASSWORD = 'Asdf1234'
const FIXTURE_AVATAR_PATHS = [
  'src/modules/fixtures/images/erlan.jpg',
  'src/modules/fixtures/images/tolik.jpg',
  'src/modules/fixtures/images/guest.jpg'
] as const
const FIXTURE_USERNAMES = [
  'erlan',
  'tolik',
  'guest',
  'alina',
  'misha',
  'dasha',
  'roma',
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
export const USER_FIXTURES = FIXTURE_USERNAMES.map((username, index) => ({
  id: buildFixtureId(index),
  email: `${username}@gmail.com`,
  username,
  pass: FIXTURE_PASSWORD,
  avatarPath: FIXTURE_AVATAR_PATHS[index % FIXTURE_AVATAR_PATHS.length]
}))
export const PRIMARY_FIXTURE_USERNAMES = {
  erlan: 'erlan',
  tolik: 'tolik',
  guest: 'guest'
} as const
export const FIXTURE_CONTACT_USERNAMES = ['tolik', 'guest', 'alina', 'misha', 'dasha', 'roma', 'nina', 'mark'] as const
export const FIXTURE_GROUPS = [
  {
    key: 'frontend-core',
    authorUsername: 'erlan',
    chatName: 'Frontend Core',
    usernames: ['erlan', 'tolik', 'alina', 'misha', 'dasha']
  },
  {
    key: 'weekend-plans',
    authorUsername: 'tolik',
    chatName: 'Weekend Plans',
    usernames: ['erlan', 'tolik', 'roma', 'nina', 'mark', 'lena']
  },
  {
    key: 'design-review',
    authorUsername: 'guest',
    chatName: 'Design Review',
    usernames: ['erlan', 'guest', 'sofia', 'marta', 'vika']
  }
] as const
export const FIXTURE_MESSAGE_COUNT = 101
