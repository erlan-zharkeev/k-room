import './style.scss'
import { createClassNameWithModifiers } from 'src/shared/lib'

import { IAppBannerProps } from './internals/types'

export const AppBanner = ({ message, type = 'info' }: IAppBannerProps) => {
  const className = createClassNameWithModifiers({ rootClass: 'app-banner', modifiers: [type] })

  return (
    <div className={className}>
      <div className="app-banner__message">{message}</div>
    </div>
  )
}
