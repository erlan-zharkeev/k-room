import fs from 'node:fs/promises'
import path from 'node:path'

import bcrypt from 'bcryptjs'
import { AppLanguage, DEFAULT_APP_LANGUAGE, REQ_STATUS } from 'common'
import mongoose from 'mongoose'

import { COMMON_MEDIA_I18N, mediaBuckets } from 'src/media'

import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'

import { USER_FIXTURES } from '../../config/constants'
import { createUser } from '../../shared/lib/create-user'
import { isUserExist } from '../../shared/lib/is-user-exist'
import { updateUserAvatar } from '../../update-user-data/lib/update-user-avatar'

const ensureAvatarLoaded = async (userId: string, avatarPath: string, language: AppLanguage) => {
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
  language: AppLanguage
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

export const loadUserFixtures = async (language: AppLanguage = DEFAULT_APP_LANGUAGE) => {
  const results = await Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data, language)))

  const created = results.filter((result) => result === 'created').length
  const updated = results.filter((result) => result === 'updated').length
  const skipped = results.filter((result) => result === 'skipped').length
  const failed = results.filter((result) => result === 'failed').length

  log.info(`-User fixtures processed: created=${created}, updated=${updated}, skipped=${skipped}, failed=${failed}`)
}
