import { IconName, UIAvatar, UIIcon } from '..'
import { ShapeModifier } from 'src/@types'
import { useNotification } from 'src/hooks'
import { imageToBase64 } from 'src/utils'

type UIAvatarLoaderShapeModifier = Extract<ShapeModifier, 'square' | 'round'>

export interface UIAvatarLoaderProps {
  path: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<React.SetStateAction<any>>
  updated?: () => void
  stubIconName?: IconName
  shape?: UIAvatarLoaderShapeModifier
}

export const UIAvatarLoader = ({
  path,
  setImage,
  setFile,
  updated,
  stubIconName,
  shape = 'round'
}: UIAvatarLoaderProps) => {
  const notifications = useNotification();

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
    <div className={`ui-avatar-loader ui-avatar-loader--${shape}`}>
      <div className="ui-avatar-loader__body">
        <UIAvatar src={path} showBadge={false} size="large" stubIconName={stubIconName} shape={shape} />
        <input type="file" onChange={normFile} />
        {path && (
          <div className="ui-avatar-loader__clear-button" onClick={resetImage}>
            <UIIcon name="cross" color="accent" />
          </div>
        )}
      </div>
    </div>
  )
}
