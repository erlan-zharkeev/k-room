import './style.scss'

import { createClassNameWithModifiers, imageToBase64 } from 'src/shared/lib'
import { useNotification } from 'src/shared/notification'
import { useI18n } from 'src/shared/preferences'
import { APP_AVATAR_LOADER_I18N } from 'src/shared/ui/AppAvatarLoader/internals/i18n'
import { AppAvatar } from 'src/shared/ui/AppAvatar/AppAvatar'
import { AppButton } from 'src/shared/ui/AppButton/AppButton'
import { IAvatarLoaderProps } from 'src/shared/ui/AppAvatarLoader/internals/types'

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
        <input type="file" onChange={normFile} aria-label={t(APP_AVATAR_LOADER_I18N.uploadImage)} />
        {path && (
          <AppButton
            prefixIconName="cross"
            color="accent-color"
            borderless
            additionalClassName="app-avatar-loader__clear-button"
            onClick={resetImage}
            ariaLabel={t(APP_AVATAR_LOADER_I18N.clearImage)}
          />
        )}
      </div>
    </div>
  )
}
