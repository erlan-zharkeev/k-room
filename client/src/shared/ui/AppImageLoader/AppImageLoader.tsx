import './style.scss'
import { ImageObject } from 'common-types'
import { useState } from 'react'
import { generateUUIDv4, imageToBase64 } from 'src/shared/utils'
import { AppIcon } from 'src/shared/ui'
import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { ImageResolutions } from 'src/shared/types'

export interface UIFileLoaderProps {
  multiple?: boolean
  allowedResolutions?: Array<string>
  setImages: (images: Array<ImageObject>) => void
}

const MAX_QUANTITY_BIND_IMAGES = 4

export const AppImageLoader = ({
  multiple = false,
  allowedResolutions = Object.values(ImageResolutions),
  setImages
}: UIFileLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const notifications = useNotification()

  const maxAttachedFilesExceedNotification = notifications.getNotification({
    message: ClientNotificationMessage.MaxAttachedFilesExceed,
    messageType: 'warning'
  })

  const normFile = async (e: { target: { files: Array<File> | any } }) => {
    setIsLoading(true)
    const images = e.target.files
    if (!images) return
    if (images.length > MAX_QUANTITY_BIND_IMAGES) {
      maxAttachedFilesExceedNotification.open()
      setIsLoading(false)
      return
    }
    let updatedImages: Array<ImageObject> = []
    ;[...images].forEach((image, idx) => {
      const reader = imageToBase64({ image, allowedResolutions, notifications })
      if (!reader) {
        setIsLoading(false)
        return
      }
      reader.onload = () => {
        updatedImages = [...updatedImages, { name: generateUUIDv4(), src: String(reader.result), fileBuffer: image }]
        if (images.length < idx + 1) return
        setImages(updatedImages)
        setIsLoading(false)
      }
    })
  }

  return (
    <div className="app-image-loader">
      <label htmlFor="file-upload">
        <AppIcon name={isLoading ? 'loader' : 'paper-clip'} />
        <input
          id="file-upload"
          type="file"
          multiple={multiple}
          onChange={normFile}
          accept={allowedResolutions.join(', ')}
        />
      </label>
    </div>
  )
}
