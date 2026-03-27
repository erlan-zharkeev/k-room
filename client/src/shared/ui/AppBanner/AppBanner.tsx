import './style.scss'
import type { IAppBannerProps } from 'src/shared/ui/AppBanner/config'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const AppBanner = ({ message, type = 'info' }: IAppBannerProps) => {
  const className = createClassNameWithModifiers({ rootClass: 'app-banner', modifiers: [type] })

  return (
    <div className={className}>
      <div className="app-banner__message">{message}</div>
    </div>
  )
}
