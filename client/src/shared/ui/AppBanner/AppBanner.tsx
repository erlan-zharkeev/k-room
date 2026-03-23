import './style.scss'
import { createClassNameWithModifiers } from 'src/shared/utils'

import type { BannerType } from './config'

export const AppBanner = ({ message, type = 'info' }: { message: string; type?: BannerType }) => {
  const className = createClassNameWithModifiers({ rootClass: 'app-banner', modifiers: [type] })

  return (
    <div className={className}>
      <div className="app-banner__message">{message}</div>
    </div>
  )
}
