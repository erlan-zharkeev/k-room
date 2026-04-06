import fs from 'node:fs/promises'
import path from 'node:path'

import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

import { AppLanguageType, DEFAULT_APP_LANGUAGE, REQ_STATUS } from 'common'

import { COMMON_MEDIA_I18N, mediaBuckets } from 'src/entities/media'
import { USER_FIXTURES } from 'src/entities/user'

import { AppError, localizedText, log } from 'src/shared/lib'

import { createUser, isUserExist } from './../../shared'
import { updateUserAvatar } from './../../update-user-data'

const ensureAvatarLoaded = async (userId: string, avatarPath: string, language: AppLanguageType) => {
  const bucket = mediaBuckets.avatar

  if (!bucket) {
    throw new AppError(REQ_STATUS.server, localizedText(COMMON_MEDIA_I18N.failedToFindBucket, language))
  }

  const filename = `avatar.${userId}`
  const existingAvatar = await bucket.find({ filename }).next()

  if (existingAvatar) return false

  const avatarSrc = path.resolve(avatarPath)
  const buffer = await fs.readFile(avatarSrc)

  await updateUserAvatar(buffer, userId, language)

  return true
}

const loadUserFixture = async (
  data: {
    id: string
    email: string
    username: string
    pass: string
    avatarPath: string
  },
  language: AppLanguageType
) => {
  const { id, username, email, pass, avatarPath } = data
  const identifier = new mongoose.Types.ObjectId(id)

  const userExistState = await isUserExist({ id: identifier, username, email })
  if (userExistState.exists) {
    const avatarLoaded = await ensureAvatarLoaded(id, avatarPath, language)

    return avatarLoaded ? 'updated' : 'skipped'
  }

  const hashedPassword = await bcrypt.hash(pass, 6)
  const user = await createUser({ id: identifier, email, username, hashedPassword })
  if (!user) {
    return 'failed'
  }

  await user.set('system.confirmed', true).save()
  await ensureAvatarLoaded(id, avatarPath, language)

  return 'created'
}

export const loadUserFixtures = async (language: AppLanguageType = DEFAULT_APP_LANGUAGE) => {
  const results = await Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data, language)))

  const created = results.filter((result) => result === 'created').length
  const updated = results.filter((result) => result === 'updated').length
  const skipped = results.filter((result) => result === 'skipped').length
  const failed = results.filter((result) => result === 'failed').length

  log.info(`-User fixtures processed: created=${created}, updated=${updated}, skipped=${skipped}, failed=${failed}`)
}
