import type { RouteLocationRaw } from 'vue-router'

export interface ISettingsNavigationItemProps {
  active?: boolean
  ariaLabel: string
  description: string
  label: string
  to: RouteLocationRaw
}
