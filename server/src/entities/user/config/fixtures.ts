import fs from 'node:fs/promises'

import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import path from 'path'

import { createUser } from 'features/user'
import { updateUserAvatar } from 'features/user/update-user-data/lib'

import { USER_FIXTURES } from 'entities/user/config/constants'

const loadUserFixture = async (data: {
  id: string
  email: string
  username: string
  pass: string
  avatarPath: string
}) => {
  const { id, username, email, pass, avatarPath } = data
  const hashedPassword = await bcrypt.hash(pass, 6)
  const identifier = new mongoose.Types.ObjectId(id)
  const user = await createUser({ id: identifier, email, username, hashedPassword })
  await user?.set('system.confirmed', true).save()
  const avatarSrc = path.resolve(avatarPath)
  const buffer = await fs.readFile(avatarSrc)
  await updateUserAvatar(buffer, id)
  return user
}

export const loadUserFixtures = async () => Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data)))
