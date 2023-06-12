import { Form } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import UIAvatar from 'src/components/UI/UIAvatar'
import UIButton from 'src/components/UI/UIButton'
import UIImageLoader from 'src/components/UI/UIImageLoader'
import UIInput from 'src/components/UI/UIInput'
import useTypedSelector from 'src/hooks/useTypedSelector'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'

export const ChatRoomSettingsPopup = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)
  const chatRoomData = chatRooms.find((room) => room.roomId === selectedChatRoomId)
  const { id } = useTypedSelector((state) => state.user.userData)

  const [image, setNewImage] = useState<string | undefined>()
  const [avatarFile, setFile] = useState()
  const isUserAuthor = chatRoomData?.authorId === id

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()
  const [isValid, validate] = useValidate()

  const onFinish = async (values: { 'chat-name': string }) => {}

  const changeFormHandler = () => {
    validate(form)
  }

  const Members = () => {
    return (
      <div className="chat-room-settings-popup__members">
        <span className="paragraph-text paragraph-text--secondary">Members:</span>
        <div className="chat-room-settings-popup__members-list">
          {chatRoomData?.users.map((user) => (
            <div className="chat-room-settings-popup__member">
              <UIAvatar src={user.avatar} showBadge={false} />
              <span className="paragraph-text paragraph-text--secondary">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const Body = () => {
    return isUserAuthor ? (
      <div className="chat-room-settings-popup__wrapper">
        <Form
          name="chat-room-settings-popup"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
          onChange={changeFormHandler}
        >
          <div className="chat-room-settings-popup__image">
            <UIImageLoader image={image} setImage={setNewImage} setFile={setFile} stubIconName="image" shape="square" />
          </div>
          <div className="chat-room-settings-popup__chat-name">
            <Form.Item>
              <UIInput placeholder="chat-name" value={chatRoomData.chatName} />
            </Form.Item>
          </div>
          <Members />
          <UIButton text="Update" border="border-default" />
        </Form>
      </div>
    ) : (
      <div className="chat-room-settings-popup__wrapper">
        <div className="chat-room-settings-popup__image">
          <UIAvatar showBadge={false} size="large" shape="square" />
        </div>
        <Members />
        <UIButton text="Close" border="border-default" onClick={() => dispatch(closeModal())} />
      </div>
    )
  }

  return (
    <div className="chat-room-settings-popup">
      <div className="chat-room-settings-popup__title">
        <span className="header-text header-text--secondary header-text--lg">{chatRoomData?.chatName}</span>
      </div>
      <Body />
    </div>
  )
}

export default ChatRoomSettingsPopup
