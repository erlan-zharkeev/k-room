import type { RouteLocationRaw } from 'vue-router'

export interface SettingsNavigationItemProps {
  active?: boolean
  ariaLabel: string
  description: string
  hasWarning?: boolean
  label: string
  to: RouteLocationRaw
}
