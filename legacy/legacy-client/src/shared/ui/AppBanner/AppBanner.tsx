import './style.scss'
import { createClassNameWithModifiers } from 'src/shared/lib'

import { AppBannerProps } from './internals/types'

export const AppBanner = ({ message, type = 'info' }: AppBannerProps) => {
  const className = createClassNameWithModifiers({ rootClass: 'app-banner', modifiers: [type] })

  return (
    <div className={className}>
      <div className="app-banner__message">{message}</div>
    </div>
  )
}
