import { CommonEndPoints } from './../../../types'
import ENV from '../ENV'
import { UserModel } from './../models/user.model'
const bcrypt = require('bcryptjs')

const users = ENV.IS_DEV ? ['erlan', 'ivan', 'tolik'] : ['erlan']

export default async () => {
  const createUser = async (username: string) => {
    const hashedPassword = await bcrypt.hash('Asdf1234', 6)
    const user = new UserModel({
      username: username.toUpperCase(),
      avatar: `${ENV.HOST}:${ENV.SERVER_PORT}${CommonEndPoints.COMMON_IMAGES}?img=${username}.jpg`,
      email: `${username}@gmail.com`,
      password: hashedPassword,
      socketId: '',
      refreshToken: username,
      confirmed: true
    })
    await user.save()
  }

  users.forEach(async (user) => {
    try {
      await createUser(user)
    } catch (e: any) {}
  })
}
