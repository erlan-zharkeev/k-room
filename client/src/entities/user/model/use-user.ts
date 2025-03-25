import { useTypedSelector } from 'src/shared/lib'

export const useUser = () => {
  const { userData, isAuth } = useTypedSelector((state) => state.user)

  return {
    ...userData,
    isAuth
  }
}
