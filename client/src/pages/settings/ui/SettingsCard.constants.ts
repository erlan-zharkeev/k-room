import type { ISettingsCardProps } from './SettingsCard.types'

export const SETTINGS_CARD_DEFAULT_PROPS = {
  buttonLabel: '',
  buttonAriaLabel: '',
  buttonDisabled: false,
  buttonLoading: false,
  onButtonClick: undefined
} satisfies Partial<ISettingsCardProps>
