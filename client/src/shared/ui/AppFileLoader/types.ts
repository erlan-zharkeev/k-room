import { FileLoaderValueType } from 'common-types'

import { AppIconName } from '../AppIcon'
import { AvatarShapeModifier } from '../types'

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
  avatarStubIcon?: AppIconName
  avatarShape?: AvatarShapeModifier
  avatarBorderless?: boolean
  showTextLabel?: boolean
}
