import './style.scss'
import { Form, Image } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/shared/lib'
import { AppSwitch, AppInput, AppButton } from 'src/shared/ui'
import { sendMessage } from 'src/shared/utils'
import { AppDispatch } from 'src/app/store'
import { closeModal } from 'src/entities/system'
import { useChatRooms } from 'src/entities/chat-room'

export const MessageWithBindDataPopup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { body, images } = useTypedSelector((state) => state.chatRooms.attachedFilesMessage)
  const { id, username } = useTypedSelector((state) => state.user.userData)
  const [compress, setCompress] = useState(true)
  const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)
  const [form] = Form.useForm()

  const dispatch = useDispatch<AppDispatch>()
  const { selectedChatRoom } = useChatRooms()

  const onFinish = async (values: { message: string }) => {
    const messageText = values.message
    setIsLoading(true)
    if (selectedChatRoom?.id) {
      const messageData = {
        authorId: id,
        roomId: selectedChatRoom.id,
        username,
        messageText,
        images,
        imageCompression: compress,
        repliedMessage: repliedMessageData,
        dispatch
      }
      sendMessage(messageData)
    }
    setIsLoading(false)
    dispatch(closeModal())
  }

  return (
    <div className="message-with-bind-data-popup">
      <Form name="send-message-with-data" initialValues={{ remember: true }} onFinish={onFinish} form={form}>
        {images && (
          <div className="message-with-bind-data-popup__images">
            <div className="message-with-bind-data-popup__compress">
              <span className="paragraph-text ">Image compression:</span>
              <AppSwitch initValue={compress} id="compression" onChange={setCompress} />
            </div>
            <div className="message-with-bind-data-popup__images-wrapper">
              {images.map((image) => (
                <div key={image.name} className="message-with-bind-data-popup__image">
                  <Image src={image.src} />
                </div>
              ))}
            </div>
          </div>
        )}
        <Form.Item name="message" initialValue={body}>
          <AppInput placeholder="Message" value="" name="message" />
        </Form.Item>
        <Form.Item className="message-with-bind-data-popup__controls">
          <AppButton
            borderless
            text="Send Message"
            htmltype="submit"
            disabled={!images?.length && !body}
            loading={isLoading}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
