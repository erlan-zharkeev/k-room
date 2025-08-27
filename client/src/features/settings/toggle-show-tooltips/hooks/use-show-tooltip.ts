import { useSettings } from 'src/entities/settings'

export const useShowTooltip = () => {
  const settings = useSettings()

  const toggleShowTooltip = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.update({ showTooltips: value })
  }

  return { toggleShowTooltip }
}
