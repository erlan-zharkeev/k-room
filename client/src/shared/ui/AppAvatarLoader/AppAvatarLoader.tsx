import './style.scss'
import { useNotification } from 'src/entities/notification'
import { useI18n } from 'src/entities/settings'

import { AppAvatar, AppIcon } from 'src/shared/ui'
import type { IAvatarLoaderProps } from 'src/shared/ui'
import { createClassNameWithModifiers, imageToBase64 } from 'src/shared/utils'

export const AppAvatarLoader = ({
  path,
  setImage,
  setFile,
  updated,
  stubIconName,
  shape = 'circle-shape'
}: IAvatarLoaderProps) => {
  const notifications = useNotification()
  const { t } = useI18n()
  const className = createClassNameWithModifiers({
    rootClass: 'app-app-avatar-loader',
    modifiers: [shape]
  })

  const normFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]
    setFile(file)
    if (!file) return
    const reader = imageToBase64({ image: file, notifications, t })
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
    <div className={className}>
      <div className="app-avatar-loader__body">
        <AppAvatar src={path ?? undefined} showBadge={false} size="large" stubIconName={stubIconName} shape={shape} />
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
