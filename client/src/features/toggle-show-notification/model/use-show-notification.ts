import { useSettings } from 'src/shared/preferences'

export const useShowNotification = () => {
  const settings = useSettings()
  const toggleShowNotification = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.shallowUpdate({ showNotification: value })
  }

  return { toggleShowNotification }
}
