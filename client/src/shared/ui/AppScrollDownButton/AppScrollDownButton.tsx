import './style.scss'

import { AppButton } from '..'

export const AppScrollDownButton = ({
  hidden = false,
  onClick = () => {}
}: {
  hidden?: boolean
  onClick?: () => void
}) => {
  return (
    <AppButton
      onClick={onClick}
      additionalClassName={`app-scroll-down-button${hidden ? ' app-scroll-down-button--hidden' : ''}`}
      prefixIconName="arrow-down"
    />
  )
}
