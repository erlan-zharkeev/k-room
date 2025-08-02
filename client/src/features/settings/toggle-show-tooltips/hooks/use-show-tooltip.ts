import { useSettings } from 'src/entities/settings'

export const useShowTooltip = () => {
  const { updateSetting } = useSettings()

  const toggleShowTooltip = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    updateSetting({ showTooltips: value })
  }

  return { toggleShowTooltip }
}
