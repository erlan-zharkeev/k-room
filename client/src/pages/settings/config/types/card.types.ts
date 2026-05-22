export interface CardProps {
  title: string
  buttonLabel?: string
  buttonAriaLabel?: string
  buttonDisabled?: boolean
  buttonLoading?: boolean
  hasWarning?: boolean
  onButtonClick?: () => void
}
