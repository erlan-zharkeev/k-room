import './style.scss'
import { BannerType } from './types'

export const AppBanner = ({ message, type = 'info' }: { message: string; type?: BannerType }) => {
  return (
    <div className={`app-banner app-banner--${type}`}>
      <div className="app-banner__message">{message}</div>
    </div>
  )
}
