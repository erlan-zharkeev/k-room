import { ReactNode } from 'react'

import { AppIconName } from 'src/shared/ui/AppIcon/internals/types'
import { BaseSizeModifier, AvatarShapeModifier } from 'src/shared/ui/internals/types'

export interface AppAvatarProps {
  online?: boolean
  src?: string
  size?: BaseSizeModifier
  showBadge?: boolean
  stubIconName?: AppIconName
  ribbon?: boolean
  ribbonPlacement?: 'up' | 'down'
  dotPlacement?: 'up' | 'down'
  shape?: AvatarShapeModifier
  preview?: boolean
  borderless?: boolean
}

export interface AvatarBodyProps {
  src?: string
  stubIconName: AppIconName
  haveSource: boolean
  setHaveSource: (value: boolean) => void
  preview?: boolean
}

export interface BadgeWrapperProps {
  children: ReactNode
  online?: boolean
  ribbon?: boolean
  ribbonPlacement: 'up' | 'down'
}
