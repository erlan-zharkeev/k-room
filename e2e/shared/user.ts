import { expect } from '@playwright/test'

import { DEFAULT_APP_LANGUAGE, normalizeNicknameKey, USER_DEFAULT_ONBOARDING } from 'global-shared'

import { E2E_ENV } from 'e2e/config'

import { UserModel } from '../../server/src/modules/user/user.model'

const PASSWORD_HASH_SOURCE_EMAIL = 'ethan@gmail.com'

type ConfirmedAppUserParams = {
  email: string
  nickname: string
}

let dbConnection: Promise<unknown> | undefined

const connectE2EDatabase = async () => {
  if (UserModel.db.readyState === 1) return

  dbConnection ??= UserModel.db.openUri(E2E_ENV.PLAYWRIGHT_MONGO_URL)
  await dbConnection
}

export const createConfirmedAppUserWithFixturePassword = async ({ email, nickname }: ConfirmedAppUserParams) => {
  await connectE2EDatabase()

  const fixtureUser = await UserModel.findOne({ 'personal.email': PASSWORD_HASH_SOURCE_EMAIL })
  const passwordHash = fixtureUser?.system.password

  expect(passwordHash).toBeTruthy()

  if (!passwordHash) {
    throw new Error(`Fixture password hash source user ${PASSWORD_HASH_SOURCE_EMAIL} was not found`)
  }

  const normalizedNickname = normalizeNicknameKey(nickname)
  const now = new Date()

  await UserModel.deleteMany({
    $or: [{ 'personal.email': email }, { 'public.nickname': normalizedNickname }]
  })

  await UserModel.create({
    public: {
      avatarId: null,
      nickname: normalizedNickname,
      lastSeen: 0
    },
    personal: {
      email,
      language: DEFAULT_APP_LANGUAGE,
      contacts: {},
      chatRooms: [],
      pinnedChatRoomIds: [],
      mutedChatRoomIds: [],
      onboarding: { ...USER_DEFAULT_ONBOARDING, welcomeCompleted: true, guideCompleted: true }
    },
    system: {
      role: 'user',
      password: passwordHash,
      provider: 'app',
      device: {},
      confirmed: true,
      confirmAttempts: 3
    },
    createdAt: now,
    updatedAt: now
  })
}
