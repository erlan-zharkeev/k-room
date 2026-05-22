import { FileLoaderValue } from 'src/shared/config'
import { AvatarShapeModifier } from 'src/shared/ui/internals/types'
import { AppIconName } from 'src/shared/ui/AppIcon/internals/types'

export interface AppFileLoaderProps {
  name: string
  multiple?: boolean
  allowedResolutions?: string[]
  showPreview?: boolean
  design?: 'avatar' | 'common'
  value?: FileLoaderValue
  onChange: (files: FileLoaderValue) => void
  maxAttachedFiles?: number
  disabled?: boolean
  avatarStubIcon?: AppIconName
  avatarShape?: AvatarShapeModifier
  avatarBorderless?: boolean
  showTextLabel?: boolean
  resetText?: string
}
