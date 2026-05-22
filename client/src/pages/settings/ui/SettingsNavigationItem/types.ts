import type { RouteLocationRaw } from 'vue-router'

export interface SettingsNavigationItemProps {
  active?: boolean
  ariaLabel: string
  description: string
  label: string
  to: RouteLocationRaw
}
