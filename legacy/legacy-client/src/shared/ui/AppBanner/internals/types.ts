export type Banner = 'success' | 'error' | 'info' | 'warning'

export interface AppBannerProps {
  message: string
  type?: Banner
}
