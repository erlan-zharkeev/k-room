import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { imageToBase64 } from 'src/utils/image-to-base64'
import { UIAvatar, UIIcon } from '..'
import { ShapeModifiers } from 'src/@types'
import { IconName } from '../UIIcon/@types'

export interface UIAvatarLoaderProps {
  path: string | undefined
  setImage: React.Dispatch<any>
  setFile: React.Dispatch<(prevState: undefined | undefined) => undefined>
  updated?: () => void
  stubIconName?: IconName
  shape?: ShapeModifiers
}

export const UIAvatarLoader = ({
  path,
  setImage,
  setFile,
  updated,
  stubIconName,
  shape = 'round'
}: UIAvatarLoaderProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const normFile = async (e: any) => {
    const file = e.target.files[0]
    setFile(file)
    if (!file) return
    const reader = imageToBase64({ image: file, dispatch })
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
