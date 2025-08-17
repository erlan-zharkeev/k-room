import fs from 'node:fs/promises'

import bcrypt from 'bcryptjs'
import { createUser } from 'features/user'
import { updateUserAvatar } from 'features/user/update-user-data/lib'
import mongoose from 'mongoose'
import path from 'path'

import { USER_FIXTURES } from './constants'

const loadUserFixture = async (data: { id: string; email: string; username: string; pass: string }) => {
  const { id, username, email, pass } = data
  const hashedPassword = await bcrypt.hash(pass, 6)
  const identifier = new mongoose.Types.ObjectId(id)
  const user = await createUser({ id: identifier, email, username, hashedPassword })
  await user?.set('system.confirmed', true).save()
  const avatarSrc = path.resolve(`src/entities/fixtures/images/${username}.jpg`)
  const buffer = await fs.readFile(avatarSrc)
  await updateUserAvatar(buffer, id)
  return user
}

export const loadUserFixtures = async () => Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data)))
