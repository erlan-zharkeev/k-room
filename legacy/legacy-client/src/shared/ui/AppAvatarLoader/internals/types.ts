import { MediaFileValue } from 'common'

import { AvatarShapeModifier } from 'src/shared/ui/internals/types'
import { AppIconName } from 'src/shared/ui/AppIcon/internals/types'

export interface AvatarLoaderProps {
  path: string | null | undefined
  setImage: React.Dispatch<React.SetStateAction<string | null | undefined>>
  setFile: React.Dispatch<React.SetStateAction<File | MediaFileValue | null>>
  updated?: () => void
  stubIconName?: AppIconName
  shape?: AvatarShapeModifier
}
