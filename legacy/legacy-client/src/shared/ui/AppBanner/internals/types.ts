export type BannerType = 'success' | 'error' | 'info' | 'warning'

export interface IAppBannerProps {
  message: string
  type?: BannerType
}
