import fs from 'node:fs/promises'
import path from 'node:path'

import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

import { StatusEnum } from 'common'

import { COMMON_MEDIA_I18N, mediaBuckets, MongooseGridFSBucketType } from 'src/entities/media'
import { USER_FIXTURES } from 'src/entities/user'

import { AppError, getLocalizedText, log } from 'src/shared/lib'

import { createUser, isUserExist } from './../../shared'
import { updateUserAvatar } from './../../update-user-data'

const ensureAvatarLoaded = async (userId: string, avatarPath: string) => {
  const bucket = mediaBuckets.avatar as MongooseGridFSBucketType | null

  if (!bucket) {
    throw new AppError(StatusEnum.Server, getLocalizedText(COMMON_MEDIA_I18N.failedToFindBucket))
  }

  const filename = `avatar.${userId}`
  const existingAvatar = await bucket.find({ filename }).next()

  if (existingAvatar) return false

  const avatarSrc = path.resolve(avatarPath)
  const buffer = await fs.readFile(avatarSrc)

  await updateUserAvatar(buffer, userId)

  return true
}

const loadUserFixture = async (data: {
  id: string
  email: string
  username: string
  pass: string
  avatarPath: string
}) => {
  const { id, username, email, pass, avatarPath } = data
  const identifier = new mongoose.Types.ObjectId(id)

  const userExistState = await isUserExist({ id: identifier, username, email })
  if (userExistState.exists) {
    const avatarLoaded = await ensureAvatarLoaded(id, avatarPath)

    return avatarLoaded ? 'updated' : 'skipped'
  }

  const hashedPassword = await bcrypt.hash(pass, 6)
  const user = await createUser({ id: identifier, email, username, hashedPassword })
  if (!user) {
    return 'failed'
  }

  await user.set('system.confirmed', true).save()
  await ensureAvatarLoaded(id, avatarPath)

  return 'created'
}

export const loadUserFixtures = async () => {
  const results = await Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data)))

  const created = results.filter((result) => result === 'created').length
  const updated = results.filter((result) => result === 'updated').length
  const skipped = results.filter((result) => result === 'skipped').length
  const failed = results.filter((result) => result === 'failed').length

  log.info(`-User fixtures processed: created=${created}, updated=${updated}, skipped=${skipped}, failed=${failed}`)
}
