import './style.scss'
import { useId, useState } from 'react'

import { IImageObject } from 'common'

import { NOTIFICATION_I18N, useNotification } from 'src/entities/notification'
import { useI18n } from 'src/entities/settings'

import { IMAGE_RESOLUTIONS } from 'src/shared/config'
import { AppAvatar, AppButton, AppIcon, AppImagePreview, APP_FILE_LOADER_I18N } from 'src/shared/ui'
import type { IAppFileLoaderProps } from 'src/shared/ui'
import { generateUUIDv4, imageToBase64 } from 'src/shared/utils'

export const AppFileLoader = ({
  name,
  multiple = false,
  allowedResolutions = Object.values(IMAGE_RESOLUTIONS),
  showPreview = true,
  design = 'common',
  value = [],
  onChange,
  maxAttachedFiles = 4,
  disabled = false,
  avatarStubIcon,
  avatarShape,
  avatarBorderless,
  showTextLabel = true,
  resetText = 'Reset'
}: IAppFileLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const notifications = useNotification()
  const { t } = useI18n()
  const previewValue = typeof value === 'string' ? value : undefined
  const inputId = useId()

  if (design === 'avatar' && multiple) {
    console.warn('AppFileLoader: design "avatar" is not compatible with multiple=true. Forcing multiple = false.')
    multiple = false
  }

  const normalizedValue: IImageObject[] = Array.isArray(value)
    ? value.filter((item): item is IImageObject => typeof item !== 'string')
    : value && typeof value !== 'string'
    ? [value]
    : []

  const updateValue = (images: IImageObject[]) => {
    onChange(multiple ? images : images[0] ?? null)
  }

  const maxAttachedFilesExceedNotification = notifications.getNotification({
    message: t(NOTIFICATION_I18N.maxAttachedFilesExceed(maxAttachedFiles)),
    messageType: 'warning'
  })

  const handleFiles = async (files: FileList | File[]) => {
    setIsLoading(true)

    if (files.length > maxAttachedFiles) {
      maxAttachedFilesExceedNotification.open()
      setIsLoading(false)
      return
    }

    const promises = Array.from(files).map(async (file) => {
      // eslint-disable-next-line
      return new Promise<IImageObject | null>((resolve) => {
        const reader = imageToBase64({ image: file, allowedResolutions, notifications, t })
        if (!reader) return resolve(null)
        reader.onload = () => {
          file.arrayBuffer().then((arrayBuffer) => {
            resolve({
              name: generateUUIDv4(),
              src: String(reader.result),
              fileBuffer: arrayBuffer
            })
          })
        }
        reader.onerror = () => resolve(null)
      })
    })

    const results = await Promise.all(promises)
    const validImages = results.filter(Boolean) as IImageObject[]

    const newValue = multiple ? [...normalizedValue, ...validImages] : validImages
    updateValue(newValue)

    setIsLoading(false)
  }

  const removeFile = (name: string) => {
    const newValue = normalizedValue.filter((img) => img.name !== name)
    updateValue(newValue)
  }

  return (
    <div className="app-file-loader">
      {showPreview && normalizedValue.length > 0 && design === 'common' && (
        <AppImagePreview removeImage={removeFile} images={normalizedValue} />
      )}
      {design === 'common' && (
        <div className="app-file-loader__actions">
          <AppButton loading={isLoading} disabled={disabled || isLoading} borderless>
            <label htmlFor={inputId} className="app-file-loader__label">
              <AppIcon name={isLoading ? 'loader' : 'paper-clip'} size="xs" />
              {showTextLabel && <span>{t(APP_FILE_LOADER_I18N.upload)}</span>}
              <input
                key={isLoading ? 'uploading' : 'ready'}
                name={name}
                disabled={disabled || isLoading}
                id={inputId}
                type="file"
                multiple={multiple}
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files)
                }}
                accept={allowedResolutions.join(', ')}
                hidden
              />
            </label>
          </AppButton>
        </div>
      )}
      {design === 'avatar' && (
        <div className="user-data-settings-modal__avatar">
          <label htmlFor={inputId} className="app-file-loader__avatar-label">
            <AppAvatar
              src={normalizedValue[0]?.src ?? previewValue}
              size="large"
              showBadge={false}
              preview={false}
              stubIconName={avatarStubIcon}
              shape={avatarShape}
              borderless={avatarBorderless}
            />
            <input
              key={isLoading ? 'uploading' : 'ready'}
              name={name}
              disabled={disabled || isLoading}
              id={inputId}
              type="file"
              multiple={false}
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files)
              }}
              accept={allowedResolutions.join(', ')}
              hidden
            />
          </label>
          <AppButton
            additionalClassName={`app-file-loader__reset-btn ${!value ? 'app-file-loader__reset-btn--hide' : ''}`}
            text={resetText === 'Reset' ? t(APP_FILE_LOADER_I18N.reset) : resetText}
            borderless
            onClick={() => {
              if (normalizedValue[0]?.name) {
                removeFile(normalizedValue[0].name)
                return
              }
              onChange(null)
            }}
          />
        </div>
      )}
    </div>
  )
}
