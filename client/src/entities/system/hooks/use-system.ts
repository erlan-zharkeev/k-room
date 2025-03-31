import { useTypedSelector } from 'src/shared/lib'

export const useSystem = () => {
  const { allowAudioContext, isAppLoading } = useTypedSelector((state) => state.system)

  return {
    allowAudioContext,
    isAppLoading
  }
}
