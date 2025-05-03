import './style.scss'
import { useState } from 'react'

import { IImageObject } from 'common-types'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'

import { ImageResolutions } from 'src/shared/types'
import { AppAvatar, AppButton, AppIcon } from 'src/shared/ui'
import { generateUUIDv4, imageToBase64 } from 'src/shared/utils'

import { FileLoaderPayloadType } from './types'

export interface AppFileLoaderProps {
  name: string
  multiple?: boolean
  allowedResolutions?: string[]
  showPreview?: boolean
  design?: 'avatar' | 'common'
  value: FileLoaderPayloadType
  onChange?: (files: FileLoaderPayloadType) => void
  maxAttachedFiles?: number
  disabled?: boolean
}

export const AppFileLoader = ({
  name,
  multiple = false,
  allowedResolutions = Object.values(ImageResolutions),
  showPreview = true,
  design = 'common',
  value,
  onChange,
  maxAttachedFiles = 4,
  disabled = false
}: AppFileLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [internalValue, setInternalValue] = useState<IImageObject[]>(value ?? [])

  const notifications = useNotification()

  const isControlled = typeof onChange === 'function'
  const actualValue = isControlled ? value ?? [] : internalValue

  const updateValue = (images: IImageObject[]) => {
    if (onChange) {
      onChange(images)
    } else {
      setInternalValue(images)
    }
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
      const promise = new Promise<IImageObject | null>((resolve) => {
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
      // eslint-disable-next-line
      return promise
    })

    const results = await Promise.all(promises)
    const validImages = results.filter(Boolean) as IImageObject[]

    updateValue(validImages)
    setIsLoading(false)
  }

  const removeFile = (name: string) => {
    updateValue(actualValue.filter((img) => img.name !== name))
  }

  return (
    <div className="app-file-loader">
      {showPreview && actualValue.length > 0 && design === 'common' && (
        <div className="app-file-loader__preview-list">
          {actualValue.map((img) => (
            <div key={img.name} className="app-file-loader__preview-item">
              <img src={img.src} alt="preview" />
              <div className="app-file-loader__remove-btn">
                <AppButton prefixIconName="cross" borderless onClick={() => removeFile(img.name)} />
              </div>
            </div>
          ))}
        </div>
      )}
      {design === 'common' && (
        <div className="app-file-loader__actions">
          <AppButton loading={isLoading} disabled={disabled || isLoading} borderless>
            <label htmlFor="file-upload" className="app-file-loader__label">
              <AppIcon name={isLoading ? 'loader' : 'paper-clip'} size="xs" />
              <span>Upload</span>
              <input
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
            <AppAvatar src={actualValue[0]?.src} size="large" showBadge={false} preview={false} />
            <input
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
          <AppButton prefixIconName="cross" borderless onClick={() => removeFile(actualValue[0]?.name)} />
        </div>
      )}
    </div>
  )
}
