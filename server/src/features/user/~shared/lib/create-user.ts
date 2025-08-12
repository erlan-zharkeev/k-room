import { ProviderType } from 'common-types'
import { UserModel } from 'entities/user'

export const createUser = ({
  email,
  username,
  hashedPassword,
  avatar,
  provider = 'app'
}: {
  email: string
  username: string
  hashedPassword: string
  avatar?: string
  provider?: ProviderType
}) => {
  return new UserModel({
    public: {
      email,
      username,
      avatar
    },
    personal: {
      role: 'user'
    },
    system: {
      password: hashedPassword,
      provider
    }
  })
}
