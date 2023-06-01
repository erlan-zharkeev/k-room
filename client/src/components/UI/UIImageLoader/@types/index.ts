import { IconName } from '../../UIIcon/@types/IconName'

export interface UIImageLoaderProps {
  image: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<(prevState: undefined) => undefined>
  updated?: () => void
  stubIconName?: IconName
}
