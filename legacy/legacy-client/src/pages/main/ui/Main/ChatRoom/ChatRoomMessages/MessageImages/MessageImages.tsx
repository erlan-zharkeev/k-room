import './message-images.scss'

import { Image } from 'antd'

import { IMessageImagesProps } from './message-images.types.ts'

export const MessageImages = ({ message }: IMessageImagesProps) => {
  if (!message.images || message.images.length <= 0) return null

  return (
    // Prevent parent message click handling when interacting with image preview content.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
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
