import { useTypedSelector } from 'src/shared/lib'

export const useCall = () => {
  return {
    ...useTypedSelector((state) => state.calls)
  }
}
