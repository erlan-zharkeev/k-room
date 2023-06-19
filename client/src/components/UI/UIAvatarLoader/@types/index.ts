import { ShapeModifiers } from 'src/@types'
import { IconName } from '../../UIIcon/@types/IconName'

export interface UIAvatarLoaderProps {
  path: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<(prevState: undefined) => undefined>
  updated?: () => void
  stubIconName?: IconName
  shape?: ShapeModifiers
}
