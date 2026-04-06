import { useSettings } from 'src/shared/settings'

export const useEnableSound = () => {
  const settings = useSettings()
  const toggleEnableSound = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.shallowUpdate({ soundOn: value })
  }

  return {
    toggleEnableSound
  }
}
