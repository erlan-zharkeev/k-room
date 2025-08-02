import { useSettings } from 'src/entities/settings'

export const useEnableSound = () => {
  const { updateSetting } = useSettings()
  const toggleEnableSound = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    updateSetting({ soundOn: value })
  }

  return {
    toggleEnableSound
  }
}
