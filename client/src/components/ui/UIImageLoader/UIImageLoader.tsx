import { v4 as uuidv4 } from 'uuid'
import { clientConstants } from 'src/client-constants'
import { NotificationMessage, NotificationType, ImageObject } from 'common-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, showNotification } from 'src/store'
import { imageToBase64 } from 'src/utils'
import { UIIcon } from '..'

export interface UIFileLoaderProps {
  multiple?: boolean
  allowedResolutions?: Array<string>
  setImages: (images: Array<ImageObject>) => void
}

export const UIImageLoader = ({
  multiple = false,
  allowedResolutions = clientConstants.imageResolutions,
  setImages
}: UIFileLoaderProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const normFile = async (e: { target: { files: Array<File> | any } }) => {
    setIsLoading(true)
    const images = e.target.files
    const { maxQuantityBindImages } = clientConstants
    if (images.length > maxQuantityBindImages) {
      dispatch(
        showNotification({
          message: NotificationMessage.maxAttachedFilesExceed,
          messageType: NotificationType.warn
        })
      )
    }
    if (!images) return
    let updatedImages: Array<ImageObject> = []
    ;[...images].forEach((image, idx) => {
      const reader = imageToBase64({ image, allowedResolutions, dispatch })
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
    <div className="ui-file-loader">
      <label htmlFor="file-upload">
        <UIIcon name={isLoading ? 'loader' : 'paper-clip'} color="default" />
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
