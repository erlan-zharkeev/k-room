import { useSettings } from 'src/entities/settings'

export const useShowNotification = () => {
  const settings = useSettings()
  const toggleShowNotification = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.update({ showNotification: value })
  }

  return { toggleShowNotification }
}
