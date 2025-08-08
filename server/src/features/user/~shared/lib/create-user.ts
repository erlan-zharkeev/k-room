import { UserModel } from 'entities/user'

export const createUser = ({
  email,
  username,
  hashedPassword
}: {
  email: string
  username: string
  hashedPassword: string
}) => {
  return new UserModel({
    public: {
      email,
      username
    },
    personal: {
      role: 'user'
    },
    system: {
      password: hashedPassword
    }
  })
}
