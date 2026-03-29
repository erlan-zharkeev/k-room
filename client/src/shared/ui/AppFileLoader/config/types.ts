import type { FileLoaderValueType } from 'src/shared/config'

import type { AppIconNameType } from '../../AppIcon'
import type { AvatarShapeModifierType } from '../../config'

export interface IAppFileLoaderProps {
  name: string
  multiple?: boolean
  allowedResolutions?: string[]
  showPreview?: boolean
  design?: 'avatar' | 'common'
  value?: FileLoaderValueType
  onChange: (files: FileLoaderValueType) => void
  maxAttachedFiles?: number
  disabled?: boolean
  avatarStubIcon?: AppIconNameType
  avatarShape?: AvatarShapeModifierType
  avatarBorderless?: boolean
  showTextLabel?: boolean
  resetText?: string
}
