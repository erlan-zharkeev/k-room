import './style.scss'
import { imageToBase64 } from 'src/shared/utils'
import { Avatar, IconName, Icon, ShapeModifier } from 'src/shared/ui'
import { useNotification } from 'src/entities/notification'

type AvatarLoaderShapeModifier = Extract<ShapeModifier, 'square' | 'round'>

export interface AvatarLoaderProps {
  path: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<React.SetStateAction<any>>
  updated?: () => void
  stubIconName?: IconName
  shape?: AvatarLoaderShapeModifier
}

export const AvatarLoader = ({
  path,
  setImage,
  setFile,
  updated,
  stubIconName,
  shape = 'round'
}: AvatarLoaderProps) => {
  const notifications = useNotification()

  const normFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]
    setFile(file)
    if (!file) return
    const reader = imageToBase64({ image: file, notifications })
    if (!reader) return
    reader.onload = () => {
      setImage(String(reader.result))
      if (updated) updated()
    }
  }

  const resetImage = () => {
    setImage(null)
    if (updated) updated()
  }

  return (
    <div className={`avatar-loader avatar-loader--${shape}`}>
      <div className="avatar-loader__body">
        <Avatar src={path} showBadge={false} size="large" stubIconName={stubIconName} shape={shape} />
        <input type="file" onChange={normFile} />
        {path && (
          <div className="avatar-loader__clear-button" onClick={resetImage}>
            <Icon name="cross" color="accent" />
          </div>
        )}
      </div>
    </div>
  )
}
