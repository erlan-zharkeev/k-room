import { CommonEndPoints } from './../../../types'
import ENV from '../ENV'
import { UserModel } from './../models/user.model'
import firstCharUpperCase from '../utils/firstCharUpperCase'
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
      settings: {
        asideTab: 'users',
        selectedChatRoomId: '',
        ableToShowNotification: true,
        theme: 'dark',
        showTooltips: false,
        soundOn: true
      }
    })
    await user.save()
  }

  users.forEach(async (user) => {
    try {
      await createUser(user)
    } catch (e: any) {}
  })
}
