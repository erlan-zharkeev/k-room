export interface ICardProps {
  title: string
  buttonLabel?: string
  buttonAriaLabel?: string
  buttonDisabled?: boolean
  buttonLoading?: boolean
  onButtonClick?: () => void
}
