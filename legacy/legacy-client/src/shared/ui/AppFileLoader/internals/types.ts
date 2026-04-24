import { FileLoaderValueType } from 'src/shared/config'
import { AvatarShapeModifierType } from 'src/shared/ui/internals/types'
import { AppIconNameType } from 'src/shared/ui/AppIcon/internals/types'

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
