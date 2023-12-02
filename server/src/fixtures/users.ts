import { ENV } from '../ENV'
import { UserModel } from '../models'
import { getInfo } from '../services'
import { firstCharUpperCase, getRequestStringToImg } from '../utils'
import { initUserSettings, initUserCodes } from './helpers'

const bcrypt = require('bcryptjs')

export const loadUsersFixtures = async () => {
  const createUser = async (username: string) => {
    const candidate = await UserModel.findOneAndUpdate({ email: `${username}@gmail.com` }, { online: false })
    if (candidate) return
    const hashedPassword = await bcrypt.hash('Asdf1234', 6)
    const user = new UserModel({
      username: firstCharUpperCase(username),
      avatarPath: `${getRequestStringToImg(username)}.jpg`,
      email: `${username}@gmail.com`,
      password: hashedPassword,
      socketId: '',
      refreshToken: username,
      confirmed: true,
      settings: initUserSettings,
      codes: initUserCodes,
      online: false,
      infoItems: [getInfo('1')]
    })
    await user.save()
  }
  const users = ENV.IS_DEV ? ['erlan', 'tolik', 'ivan'] : ['erlan']
  const promises = users.map(createUser)
  return await Promise.all(promises)
}
