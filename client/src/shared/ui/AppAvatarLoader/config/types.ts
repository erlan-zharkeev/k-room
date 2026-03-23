import type { AvatarShapeModifier } from '../../config'
import type { AppIconName } from '../AppIcon'

export interface IAvatarLoaderProps {
  path: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<React.SetStateAction<any>>
  updated?: () => void
  stubIconName?: AppIconName
  shape?: AvatarShapeModifier
}
