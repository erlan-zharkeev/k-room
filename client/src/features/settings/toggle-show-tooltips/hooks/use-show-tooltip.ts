import { useSettings } from 'src/shared/settings'

export const useShowTooltip = () => {
  const settings = useSettings()

  const toggleShowTooltip = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.shallowUpdate({ showTooltips: value })
  }

  return { toggleShowTooltip }
}
