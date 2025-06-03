import './style.scss'
import { useNotification } from 'src/entities/notification'

import { AppAvatar, AppIconName, AppIcon, AvatarShapeModifier } from 'src/shared/ui'
import { imageToBase64 } from 'src/shared/utils'

export interface AvatarLoaderProps {
  path: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<React.SetStateAction<any>>
  updated?: () => void
  stubIconName?: AppIconName
  shape?: AvatarShapeModifier
}

export const AppAvatarLoader = ({
  path,
  setImage,
  setFile,
  updated,
  stubIconName,
  shape = 'circle-shape'
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
    <div className={`app-app-avatar-loader app-app-avatar-loader--${shape}`}>
      <div className="app-avatar-loader__body">
        <AppAvatar src={path} showBadge={false} size="large" stubIconName={stubIconName} shape={shape} />
        <input type="file" onChange={normFile} />
        {path && (
          <div className="app-avatar-loader__clear-button" onClick={resetImage}>
            <AppIcon name="cross" color="accent-color" />
          </div>
        )}
      </div>
    </div>
  )
}
