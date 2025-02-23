import { useTypedSelector } from 'src/shared/lib'

export const useSystem = () => {
  const { allowAudioContext } = useTypedSelector((state) => state.system)

  return {
    allowAudioContext
  }
}
