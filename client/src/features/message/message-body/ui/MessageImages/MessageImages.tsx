import './style.scss'

import { Image } from 'antd'

import { IMessageImagesProps } from 'src/features/message/message-body'

export const MessageImages = ({ message }: IMessageImagesProps) => {
  if (!message.images || message.images.length <= 0) return null

  return (
    <div
      className="message-images"
      onClick={(evt) => {
        evt.stopPropagation()
      }}
    >
      {message.images.map((image) => (
        <div key={image.name} className="message-images__image">
          <Image src={image.src} />
        </div>
      ))}
    </div>
  )
}
