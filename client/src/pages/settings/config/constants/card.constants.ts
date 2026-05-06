import type { ICardProps } from '../types/card.types'

export const CARD_DEFAULT_PROPS = {
  buttonLabel: '',
  buttonAriaLabel: '',
  buttonDisabled: false,
  buttonLoading: false,
  onButtonClick: undefined
} satisfies Partial<ICardProps>
