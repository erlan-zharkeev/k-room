import type { UnknownObject } from 'global-shared'
import { Types } from 'mongoose'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mediaMock = vi.hoisted(() => ({
  deleteBucketFileById: vi.fn(),
  uploadBufferToBucket: vi.fn(),
  withUploadedMediaCleanup: vi.fn(async (callback) => callback(vi.fn()))
}))

const codeModelMock = vi.hoisted(() => ({
  findOne: vi.fn(),
  updateOne: vi.fn()
}))

const userModelMock = vi.hoisted(() => {
  class UserModel {
    static findOne = vi.fn()
    static findById = vi.fn()
    static find = vi.fn()
    static updateOne = vi.fn()
    static findOneAndUpdate = vi.fn()

    _id: unknown
    createdAt: Date
    system: unknown
    personal: unknown
    public: unknown
    markModified = vi.fn()
    save = vi.fn()

    constructor(data: UnknownObject) {
      Object.assign(this, data)
      this._id = data._id ?? 'generated-id'
      this.createdAt = new Date(1000)
      this.save.mockResolvedValue(this)
    }
  }

  return { UserModel }
})

vi.mock('../media/media.service', () => mediaMock)
vi.mock('../codes/codes.model', () => ({ CodeModel: codeModelMock }))
vi.mock('./user.model', () => ({ UserModel: userModelMock.UserModel }))

const userServiceModule = await import('./user.service')
const userExistenceModule = await import('./lib/user-existence')
const googleAvatarModule = await import('./lib/load-google-avatar')
const userAvatarModule = await import('./lib/update-user-avatar')
const { UserService } = userServiceModule
const { createUser, isUserExist } = userExistenceModule
const { loadGoogleAvatar } = googleAvatarModule
const { updateUserAvatar } = userAvatarModule

describe('user.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mediaMock.uploadBufferToBucket.mockResolvedValue('uploaded-avatar-id')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('detects existing users by nickname before trying email or id', async () => {
    userModelMock.UserModel.findOne.mockResolvedValueOnce({ _id: 'by-nickname' })

    const result = await isUserExist({
      nickname: 'tester',
      email: 'tester@test.com',
      id: new Types.ObjectId('68a09410778b70d522ea8faa')
    })

    expect(result).toEqual({ exists: true, reason: 'nickname' })
    expect(userModelMock.UserModel.findOne).toHaveBeenCalledTimes(1)
    expect(userModelMock.UserModel.findById).not.toHaveBeenCalled()
  })

  it('finds user by normalized nickname or trimmed email login', async () => {
    const service = new UserService()

    userModelMock.UserModel.findOne.mockResolvedValueOnce({ _id: 'user-by-nickname' })
    userModelMock.UserModel.findOne.mockResolvedValueOnce({ _id: 'user-by-email' })

    await service.findByLogin('@Test-Er')
    await service.findByLogin('  tester@test.com  ')

    expect(userModelMock.UserModel.findOne).toHaveBeenNthCalledWith(1, { 'public.nickname': 'test-er' })
    expect(userModelMock.UserModel.findOne).toHaveBeenNthCalledWith(2, { 'personal.email': 'tester@test.com' })
  })

  it('creates user with requested fixture id', async () => {
    const id = new Types.ObjectId('68a09410778b70d522ea8faa')

    userModelMock.UserModel.findOne.mockResolvedValue(null)
    userModelMock.UserModel.findById.mockResolvedValue(null)

    const user = await createUser({
      id,
      email: 'tester@test.com',
      nickname: 'tester',
      hashedPassword: 'hashed'
    })

    expect(user?._id).toBe(id)
    expect(user?.system).toMatchObject({
      role: 'user',
      password: 'hashed',
      provider: 'app',
      confirmed: false,
      confirmAttempts: 3
    })
  })

  it('uploads and deletes user avatar through media bucket helpers', async () => {
    const buffer = Buffer.from('avatar')

    const avatarId = await updateUserAvatar(buffer, null)
    await updateUserAvatar(null, 'uploaded-avatar-id')

    expect(avatarId).toBe('uploaded-avatar-id')
    expect(mediaMock.uploadBufferToBucket).toHaveBeenCalledWith(buffer, 'image', {
      compression: 'avatar',
      validation: {
        maxMb: 10,
        supportedKindMediaType: 'image'
      }
    })
    expect(mediaMock.deleteBucketFileById).toHaveBeenCalledWith('image', 'uploaded-avatar-id')
  })

  it('loads only allowed Google avatar hosts', async () => {
    const arrayBuffer = new Uint8Array([1, 2, 3]).buffer
    const fetchMock = vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer) })

    vi.stubGlobal('fetch', fetchMock)

    const blocked = await loadGoogleAvatar('https://example.com/avatar.jpg')
    const loaded = await loadGoogleAvatar('https://lh3.googleusercontent.com/avatar.jpg')

    expect(blocked).toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(loaded).toEqual(Buffer.from(arrayBuffer))
  })

  it('resets password only with valid query token and clears used recovery state', async () => {
    const service = new UserService()

    vi.spyOn(Date, 'now').mockReturnValue(100_000)
    codeModelMock.findOne.mockResolvedValue({
      _id: 'user-1',
      codes: {
        passwordRecovery: {
          query: {
            value: 'query-token',
            expiresAt: 100_001
          }
        }
      },
    })

    await service.resetPassword({ codeToValidate: 'query-token', password: 'Asdf1234' })

    expect(userModelMock.UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'user-1' },
      { 'system.password': expect.any(String) }
    )
    expect(codeModelMock.updateOne).toHaveBeenCalledWith(
      {
        _id: 'user-1'
      },
      {
        $set: {
          'codes.passwordRecovery.query.value': '',
          'codes.passwordRecovery.query.expiresAt': 0,
          'codes.passwordRecovery.email.value': '',
          'codes.passwordRecovery.email.expiresAt': 0,
          nextRequestPossibleAt: null
        }
      }
    )
  })

  it('changes user email when target email is free', async () => {
    const updateOne = vi.fn()
    const service = new UserService()

    userModelMock.UserModel.findById.mockResolvedValue({
      personal: { email: 'old@test.com' },
      updateOne
    })
    userModelMock.UserModel.findOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue(null)
    })

    await service.changeEmail({ userId: 'user-1', email: 'new@test.com' })

    expect(userModelMock.UserModel.findOne).toHaveBeenCalledWith({
      _id: { $ne: 'user-1' },
      'personal.email': 'new@test.com'
    })
    expect(updateOne).toHaveBeenCalledWith({
      $set: {
        'personal.email': 'new@test.com',
        'system.confirmed': true
      }
    })
  })
})
