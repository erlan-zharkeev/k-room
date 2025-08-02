import { useSettings } from 'src/entities/settings'

export const useShowNotification = () => {
  const { updateSetting } = useSettings()
  const toggleShowNotification = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    updateSetting({ showNotification: value })
  }

  return { toggleShowNotification }
}
