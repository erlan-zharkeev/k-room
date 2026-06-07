export interface AuthLayoutProps {
  blockNavigation?: boolean
}

export type AuthLayoutSignalStyle = Record<`--auth-layout-${string}`, string>

export interface AuthLayoutSignalPosition {
  left: string
  top: string
}

export interface AuthLayoutSignalItem {
  id: string
  style: AuthLayoutSignalStyle
}
