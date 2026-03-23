import { AppIconName } from '../AppIcon'
import type { AvatarShapeModifier } from '../../config'

export interface IAvatarLoaderProps {
  path: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<React.SetStateAction<any>>
  updated?: () => void
  stubIconName?: AppIconName
  shape?: AvatarShapeModifier
}
