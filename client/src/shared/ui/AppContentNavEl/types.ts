import type { RouteLocationRaw } from 'vue-router'

export interface IAppContentNavElProps {
  active?: boolean
  ariaLabel: string
  description: string
  label: string
  to: RouteLocationRaw
}
