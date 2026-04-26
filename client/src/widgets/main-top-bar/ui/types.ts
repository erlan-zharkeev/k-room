import type { StyleValue } from 'vue'

export interface IMainTopBarProps {
  imageAlt: string
  imageId: string
  isLogoutLoading: boolean
  logoutLabel: string
  subtitle: string
  title: string
  wallpaperStyle?: StyleValue
}
