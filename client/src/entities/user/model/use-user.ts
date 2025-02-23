import { useTypedSelector } from 'src/shared/lib'

export const useUser = () => {
  const { username, email, avatarPath, infoItems, role } = useTypedSelector((state) => state.user.userData)

  return {
    username,
    email,
    avatarPath,
    infoItems,
    role
  }
}
