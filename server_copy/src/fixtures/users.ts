import { UserModel } from 'entities/user'
import { ENV } from '../app/config/constants'
import { getPreviewInfoNotification } from '../services'
import { firstCharUpperCase, getRequestStringToImg } from '../utils'
import { initUserCodes } from './helpers'

const bcrypt = require('bcryptjs')

const usersDevFixtures = [
  { username: 'tolik' }
  // { username: 'ivan' },
  // { username: 'guest-1' },
  // { username: 'guest-2' },
  // { username: 'guest-3' }
]
const adminDevFixtures = [{ username: 'erlan', admin: true }]

const usersProdFixtures = [{ username: 'guest-1' }]
const adminProdFixtures = [{ username: 'erlan', admin: true, password: ENV.K_ROOM_ADMIN_PASS }]

export const loadUsersFixtures = async (loadAdmin: boolean) => {
  const createUser = async ({
    username,
    admin,
    password
  }: {
    username: string
    admin?: boolean
    password?: string
  }) => {
    const candidate = await UserModel.findOneAndUpdate({ email: `${username}@gmail.com` }, { online: false })
    if (candidate) return
    const pass = password ? password : 'Asdf1234'
    const hashedPassword = await bcrypt.hash(pass, 6)
    const avatarFilename = username.includes('guest') ? 'guest' : username
    const user = new UserModel({
      username: firstCharUpperCase(username),
      role: admin ? 'admin' : 'user',
      avatarPath: `${getRequestStringToImg(avatarFilename)}.jpg`,
      email: `${username}@gmail.com`,
      password: hashedPassword,
      socketId: '',
      refreshToken: username,
      confirmed: true,
      codes: initUserCodes,
      online: false,
      infoNotifications: [getPreviewInfoNotification('1')]
    })
    await user.save()
  }

  let fixtures = []

  if (ENV.IS_DEV) {
    if (loadAdmin) fixtures = [...usersDevFixtures, ...adminDevFixtures]
    else fixtures = usersDevFixtures
  } else {
    if (loadAdmin) fixtures = [...usersProdFixtures, ...adminProdFixtures]
    else fixtures = usersProdFixtures
  }

  const promises = fixtures.map(createUser)
  return await Promise.all(promises)
}
