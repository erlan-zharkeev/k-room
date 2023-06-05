import { CommonEndPoints } from './../../../types'
import ENV from '../ENV'
import { UserModel } from './../models/user.model'
import firstCharUpperCase from '../utils/firstCharUpperCase'
import initUserSettings from './initUserSettings'
import { initUserCodes } from './initUserCodes'
import { getInfo } from '../services/info/getInfo'
const bcrypt = require('bcryptjs')

export default async () => {
  const createUser = async (username: string) => {
    const candidate = await UserModel.findOne({ email: `${username}@gmail.com` })
    if (candidate) return
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
      codes: initUserCodes,
      infoItems: [getInfo('1')]
    })
    await user.save()
  }
  const users = ENV.IS_DEV ? ['erlan'] : ['erlan']
  const promises = users.map(createUser)
  return await Promise.all(promises)
}
