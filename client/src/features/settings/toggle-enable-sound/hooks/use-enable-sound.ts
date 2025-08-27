import { useSettings } from 'src/entities/settings'

export const useEnableSound = () => {
  const settings = useSettings()
  const toggleEnableSound = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.update({ soundOn: value })
  }

  return {
    toggleEnableSound
  }
}
