import type { FileLoaderValueType } from 'src/shared/config'
import type { AppIconName } from 'src/shared/ui/AppIcon'
import type { AvatarShapeModifier } from 'src/shared/ui/config'

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
  resetText?: string
}
