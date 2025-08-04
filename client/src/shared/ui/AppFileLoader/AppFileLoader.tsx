import './style.scss'
import { useState } from 'react'

import { IImageObject } from 'common-types'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'

import { ImageResolutions } from 'src/shared/config/types'
import { AppAvatar, AppButton, AppIcon, AppImagePreview } from 'src/shared/ui'
import { generateUUIDv4, imageToBase64 } from 'src/shared/utils'

import type { IAppFileLoaderProps } from './types'

export const AppFileLoader = ({
  name,
  multiple = false,
  allowedResolutions = Object.values(ImageResolutions),
  showPreview = true,
  design = 'common',
  value = [],
  onChange,
  maxAttachedFiles = 4,
  disabled = false,
  avatarStubIcon,
  avatarShape,
  avatarBorderless,
  showTextLabel = true
}: IAppFileLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const notifications = useNotification()

  if (design === 'avatar' && multiple) {
    console.warn('AppFileLoader: design "avatar" is not compatible with multiple=true. Forcing multiple = false.')
    multiple = false
  }

  const normalizedValue: IImageObject[] = Array.isArray(value) ? value : value ? [value] : []

  const updateValue = (images: IImageObject[]) => {
    onChange(multiple ? images : images[0] ?? null)
  }

  const maxAttachedFilesExceedNotification = notifications.getNotification({
    message: ClientNotificationMessage.MaxAttachedFilesExceed,
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
        const reader = imageToBase64({ image: file, allowedResolutions, notifications })
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
            <label htmlFor="file-upload" className="app-file-loader__label">
              <AppIcon name={isLoading ? 'loader' : 'paper-clip'} size="xs" />
              {showTextLabel && <span>Upload</span>}
              <input
                key={isLoading ? 'uploading' : 'ready'}
                name={name}
                disabled={disabled || isLoading}
                id="file-upload"
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
          <label htmlFor="file-upload" className="app-file-loader__avatar-label">
            <AppAvatar
              src={normalizedValue[0]?.src}
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
              id="file-upload"
              type="file"
              multiple={false}
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files)
              }}
              accept={allowedResolutions.join(', ')}
              hidden
            />
          </label>
          {normalizedValue[0]?.src && (
            <AppButton text="Reset" borderless onClick={() => removeFile(normalizedValue[0].name)} />
          )}
        </div>
      )}
    </div>
  )
}
