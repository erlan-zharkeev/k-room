import { AppIconName } from '../AppIcon'
import { AvatarShapeModifier } from '../types'

export interface IAvatarLoaderProps {
  path: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<React.SetStateAction<any>>
  updated?: () => void
  stubIconName?: AppIconName
  shape?: AvatarShapeModifier
}
