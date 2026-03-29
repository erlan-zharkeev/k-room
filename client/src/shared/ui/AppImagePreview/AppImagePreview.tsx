import './style.scss'
import { IImageObject } from 'common'

import { AppButton, AppScrollContainer } from 'src/shared/ui'

export const AppImagePreview = ({
  images,
  removeImage
}: {
  images: IImageObject[]
  removeImage: (name: string) => void
}) => {
  return (
    <AppScrollContainer additionalClassName="app-image-preview">
      {images.map((img) => (
        <div key={img.name} className="app-image-preview__preview-item">
          <img src={img.src} alt="preview" />
          <div className="app-image-preview__remove-btn">
            <AppButton prefixIconName="cross" borderless onClick={() => removeImage(img.name)} />
          </div>
        </div>
      ))}
    </AppScrollContainer>
  )
}
