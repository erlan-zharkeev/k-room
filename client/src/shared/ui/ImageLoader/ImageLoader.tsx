import './style.scss'
import { v4 as uuidv4 } from 'uuid'
import { ImageObject } from 'common-types'
import { useState } from 'react'
import { imageToBase64 } from 'src/shared/utils'
import { Icon } from 'src/shared/ui'
import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { ImageResolutions } from 'src/shared/types'

export interface UIFileLoaderProps {
  multiple?: boolean
  allowedResolutions?: Array<string>
  setImages: (images: Array<ImageObject>) => void
}

const MAX_QUANTITY_BIND_IMAGES = 4

export const ImageLoader = ({
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
        updatedImages = [...updatedImages, { name: uuidv4(), src: String(reader.result), fileBuffer: image }]
        if (images.length < idx + 1) return
        setImages(updatedImages)
        setIsLoading(false)
      }
    })
  }

  return (
    <div className="image-loader">
      <label htmlFor="file-upload">
        <Icon name={isLoading ? 'loader' : 'paper-clip'} color="default" />
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
