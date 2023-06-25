import useTypedSelector from 'src/hooks/useTypedSelector'
import { Form, Image } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import sendMessage from 'src/utils/sendMessage'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import { UISwitch, UIInput, UIButton } from 'src/components/UI'

const MessageWithBindDataPopup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { body, files } = useTypedSelector((state) => state.chatRooms.attachedFilesMessage)
  const { id, username } = useTypedSelector((state) => state.user.userData)
  const [compress, setCompress] = useState(true)
  const [form] = Form.useForm()

  const dispatch = useDispatch<AppDispatch>()
  const selectedChatRoom = useSelectedRoom()

  const onFinish = async (values: { message: string }) => {
    const messageText = values.message
    setIsLoading(true)
    const transformedFiles = files.map((file) => {
      return {
        ...file,
        src: ''
      }
    })
    if (selectedChatRoom?.id) {
      const messageData = {
        authorId: id,
        roomId: selectedChatRoom.id,
        username,
        messageText,
        files: transformedFiles,
        imageCompression: compress,
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
        {files && (
          <div className="message-with-bind-data-popup__images">
            <div className="message-with-bind-data-popup__compress">
              <span className="paragraph-text paragraph-text--secondary">Image compression:</span>
              <UISwitch initValue={compress} id="compression" onChange={setCompress} />
            </div>
            <div className="message-with-bind-data-popup__images-wrapper">
              {files.map((file) => (
                <div key={file.name} className="message-with-bind-data-popup__image">
                  <Image src={file.src} />
                </div>
              ))}
            </div>
          </div>
        )}
        <Form.Item name="message" initialValue={body}>
          <UIInput placeholder="Message" />
        </Form.Item>
        <Form.Item className="message-with-bind-data-popup__controls">
          <UIButton
            text="Send Message"
            border="border-default"
            htmltype={'submit'}
            disabled={!files?.length && !body}
            loading={isLoading}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default MessageWithBindDataPopup
