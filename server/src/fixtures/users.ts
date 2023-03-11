import { CommonEndPoints } from './../../../types'
import ENV from '../ENV'
import { UserModel } from './../models/user.model'
import firstCharUpperCase from '../utils/firstCharUpperCase'
import initUserSettings from './initUserSettings'
import { initUserCodes } from './initUserCodes'
const bcrypt = require('bcryptjs')

const users = ENV.IS_DEV ? ['erlan', 'ivan', 'tolik'] : ['erlan']

export default async () => {
  const createUser = async (username: string) => {
    const hashedPassword = await bcrypt.hash('Asdf1234', 6)
    const user = new UserModel({
      username: firstCharUpperCase(username),
      avatar: `${ENV.SERVER_URL}${CommonEndPoints.COMMON_IMAGES}?img=${username}.jpg`,
      email: `${username}@gmail.com`,
      password: hashedPassword,
      socketId: '',
      refreshToken: username,
      confirmed: true,
      settings: initUserSettings,
      codes: initUserCodes
    })
    await user.save()
  }

  users.forEach(async (user) => {
    try {
      await createUser(user)
    } catch (e: any) {}
  })
}
