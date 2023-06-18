import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import UIIcon from '../UIIcon/UIIcon'
import { ImageObject, UIFileLoaderProps } from './@types'
import imageToBase64 from 'src/utils/imageToBase64'
import { showNotification } from 'src/store/systemSlice'
import constants from 'src/constants'
import { useState } from 'react'

const UIFileLoader = ({
  multiple = false,
  allowedResolutions = constants.imageResolutions,
  setImages
}: UIFileLoaderProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const normFile = async (e: { target: { files: Array<File> | any } }) => {
    setIsLoading(true)
    const files = e.target.files
    const { maxQuantityBindImages } = constants
    if (files.length > maxQuantityBindImages) {
      dispatch(
        showNotification({
          message: `The maximum number of attached images should not exceed ${maxQuantityBindImages}`,
          messageType: 'warning'
        })
      )
    }
    if (!files) return
    let updatedImages: Array<ImageObject> = []
    ;[...files].forEach((file, idx) => {
      const reader = imageToBase64({ file, allowedResolutions, dispatch })
      if (!reader) {
        setIsLoading(false)
        return
      }
      reader.onload = () => {
        updatedImages = [...updatedImages, { name: file.name, src: String(reader.result), file }]
        if (files.length < idx + 1) return
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

export default UIFileLoader
