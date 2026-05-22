import type { CardProps } from '../types/card.types'

export const CARD_DEFAULT_PROPS = {
  buttonLabel: '',
  buttonAriaLabel: '',
  buttonDisabled: false,
  buttonLoading: false,
  hasWarning: false,
  onButtonClick: undefined
} satisfies Partial<CardProps>
