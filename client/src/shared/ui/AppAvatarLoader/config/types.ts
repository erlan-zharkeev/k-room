import type { MediaFileValueType } from 'common'

import type { AppIconName } from '../../AppIcon'
import type { AvatarShapeModifier } from '../../config'

export interface IAvatarLoaderProps {
  path: string | null | undefined
  setImage: React.Dispatch<React.SetStateAction<string | null | undefined>>
  setFile: React.Dispatch<React.SetStateAction<File | MediaFileValueType | null>>
  updated?: () => void
  stubIconName?: AppIconName
  shape?: AvatarShapeModifier
}
