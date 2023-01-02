import { UserModel } from "./../models/user.model"
const bcrypt = require('bcryptjs')

const users = ['erlan', 'anton']

export default async () => {
  const createUser = async (username: string) => {
    const hashedPassword = await bcrypt.hash('Asdf1234', 6)
    const user = new UserModel({ username: username.toUpperCase(), email: `${username}@gmail.com`, password: hashedPassword, socketId: '', refreshToken: username, confirmed: true })
    await user.save()
  }

  users.forEach(async (user) => {
    try {
      await createUser(user)
    } catch (e: any) {}
  })
}
