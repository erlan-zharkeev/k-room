import { MediaFileValueType } from 'common'

import { AppIconNameType } from 'src/shared/ui/AppIcon'
import { AvatarShapeModifierType } from 'src/shared/ui/config'

export interface IAvatarLoaderProps {
  path: string | null | undefined
  setImage: React.Dispatch<React.SetStateAction<string | null | undefined>>
  setFile: React.Dispatch<React.SetStateAction<File | MediaFileValueType | null>>
  updated?: () => void
  stubIconName?: AppIconNameType
  shape?: AvatarShapeModifierType
}
