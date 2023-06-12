import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { showNotification } from 'src/store/systemSlice'
import UIAvatar from 'ui/UIAvatar'
import UIIcon from '../UIIcon'
import { UIImageLoaderProps } from './@types'

const UIImageLoader = ({ image, setImage, setFile, updated, stubIconName, shape = 'round' }: UIImageLoaderProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const normFile = async (e: any) => {
    const file = e.target.files[0]
    setFile(file)
    if (!file) return
    imageToBase64(file)
  }

  const resetImage = () => {
    setImage(null)
    if (updated) updated()
  }

  const imageToBase64 = (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const warnings = []

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) warnings.push('image resolution must be png or jpg')
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) warnings.push('image size must be less than 2mb')

    if (warnings.length) {
      warnings.forEach((warning) => {
        dispatch(showNotification({ message: warning, messageType: 'warning' }))
      })
      return
    }

    reader.onload = () => {
      setImage(String(reader.result))
      if (updated) updated()
    }

    reader.onerror = (error) => {
      console.log(error)
    }
  }

  return (
    <div className={`ui-image-loader ui-image-loader--${shape}`}>
      <div className="ui-image-loader__body">
        <UIAvatar src={image} showBadge={false} size="large" stubIconName={stubIconName} shape={shape} />
        <input type="file" onChange={normFile} />
        {image && (
          <div className="ui-image-loader__clear-button" onClick={resetImage}>
            <UIIcon name="cross" color="accent" />
          </div>
        )}
      </div>
    </div>
  )
}

export default UIImageLoader
