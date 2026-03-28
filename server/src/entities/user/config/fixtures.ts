import fs from 'node:fs/promises'
import path from 'node:path'

import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { USER_FIXTURES } from 'src/entities/user/config'
import { isUserExist } from 'src/features/auth'
import { createUser } from 'src/features/user'
import { updateUserAvatar } from 'src/features/user/update-user-data'
import { log } from 'src/shared/lib'

const loadUserFixture = async (data: {
  id: string
  email: string
  username: string
  pass: string
  avatarPath: string
}) => {
  const { id, username, email, pass, avatarPath } = data
  const identifier = new mongoose.Types.ObjectId(id)

  const userAlreadyExists = await isUserExist({ id: identifier, username, email })
  if (userAlreadyExists) {
    return 'skipped' as const
  }

  const hashedPassword = await bcrypt.hash(pass, 6)
  const user = await createUser({ id: identifier, email, username, hashedPassword })
  if (!user) {
    return 'failed' as const
  }

  await user?.set('system.confirmed', true).save()
  const avatarSrc = path.resolve(avatarPath)
  const buffer = await fs.readFile(avatarSrc)
  await updateUserAvatar(buffer, id)
  return 'created' as const
}

export const loadUserFixtures = async () => {
  const results = await Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data)))

  const created = results.filter((result) => result === 'created').length
  const skipped = results.filter((result) => result === 'skipped').length
  const failed = results.filter((result) => result === 'failed').length

  log.info(`-User fixtures processed: created=${created}, skipped=${skipped}, failed=${failed}`)
}
