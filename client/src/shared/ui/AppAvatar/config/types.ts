import { ReactNode } from 'react'

import { AppIconNameType } from 'src/shared/ui/AppIcon'
import { BaseSizeModifierType, AvatarShapeModifierType } from 'src/shared/ui/config'

export interface IAppAvatarProps {
  online?: boolean
  src?: string
  size?: BaseSizeModifierType
  showBadge?: boolean
  stubIconName?: AppIconNameType
  ribbon?: boolean
  ribbonPlacement?: 'up' | 'down'
  dotPlacement?: 'up' | 'down'
  shape?: AvatarShapeModifierType
  preview?: boolean
  borderless?: boolean
}

export interface IAvatarBodyProps {
  src?: string
  stubIconName: AppIconNameType
  haveSource: boolean
  setHaveSource: (value: boolean) => void
  preview?: boolean
}

export interface IBadgeWrapperProps {
  children: ReactNode
  online?: boolean
  ribbon?: boolean
  ribbonPlacement: 'up' | 'down'
}
