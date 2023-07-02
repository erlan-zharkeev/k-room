import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { UIFileLoaderProps } from './@types'
import { ImageObject } from 'common-types'
import { imageToBase64 } from 'src/utils/imageToBase64'
import { showNotification } from 'src/store/systemSlice'
import constants from 'src/constants'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { UIIcon } from '..'

const UIImageLoader = ({
  multiple = false,
  allowedResolutions = constants.imageResolutions,
  setImages
}: UIFileLoaderProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const normFile = async (e: { target: { files: Array<File> | any } }) => {
    setIsLoading(true)
    const images = e.target.files
    const { maxQuantityBindImages } = constants
    if (images.length > maxQuantityBindImages) {
      dispatch(
        showNotification({
          message: `The maximum number of attached images should not exceed ${maxQuantityBindImages}`,
          messageType: 'warning'
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

export default UIImageLoader
