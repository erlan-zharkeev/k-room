import type { LocalizedTextType } from 'global-shared'

import type { AppIconNameType } from 'src/shared/ui'

export interface IMainLeftBarNavItem {
  id: string
  path: string
  label: LocalizedTextType
  icon: AppIconNameType
}

export interface IMainLeftBarProps {
  appName: string
  navItems: IMainLeftBarNavItem[]
  selectedSettingsId: string
  settingsRoutePrefix: string
  unreadInfoNotifications: number
  unreadMessages: number
  wallpaperStyle?: Record<string, string | undefined>
}
