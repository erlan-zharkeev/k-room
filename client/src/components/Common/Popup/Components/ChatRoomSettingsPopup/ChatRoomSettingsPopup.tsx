import { Form } from 'antd'
import { SocketActions, SocketActionsPayload } from 'common-types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { UIAvatar, UIAvatarLoader, UIInput, UIButton } from 'src/components/UI'
import useTypedSelector from 'src/hooks/useTypedSelector'
import useValidate from 'src/hooks/useValidate'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import { validateRules } from 'src/utils/validateRules'

const ChatRoomSettingsPopup = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)
  const chatRoomData = chatRooms.find((room) => room.id === selectedChatRoomId)
  const { id } = useTypedSelector((state) => state.user.userData)
  const [imagePath, setNewImagePath] = useState<string | undefined>(chatRoomData?.avatarPath)
  const [avatarFile, setFile] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const isUserAuthor = chatRoomData?.authorId === id

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()
  const [isValid, validate] = useValidate()

  const onFinish = async (values: { 'chat-name': string }) => {
    const userIds = chatRoomData?.users.map((user) => user.id) ?? []
    const updatedValues: SocketActionsPayload['update-chat-room'] = {
      roomId: selectedChatRoomId,
      users: [id, ...userIds],
      chatName: values['chat-name'],
      avatarPath: imagePath ?? '',
      avatarFile: avatarFile,
      authorId: id
    }
    setIsLoading(true)

    socket.emit(SocketActions['update-chat-room'], updatedValues)
    socket.on(SocketActions['room-data-updated'], () => {
      setIsLoading(false)
      dispatch(closeModal())
    })
  }

  useEffect(() => {
    validate(form)
  })

  const changeFormHandler = () => {
    validate(form)
  }

  const Members = () => {
    return (
      <div className="chat-room-settings-popup__members">
        <span className="paragraph-text paragraph-text--secondary">Members:</span>
        <div className="chat-room-settings-popup__members-list">
          {chatRoomData?.users?.map((user) => (
            <div className="chat-room-settings-popup__member">
              <UIAvatar src={user.avatarPath} showBadge={false} />
              <span className="paragraph-text paragraph-text--secondary">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="chat-room-settings-popup">
      <div className="chat-room-settings-popup__title">
        <span className="header-text header-text--secondary header-text--lg">{chatRoomData?.chatName}</span>
      </div>
      {isUserAuthor ? (
        <div className="chat-room-settings-popup__wrapper">
          <Form
            name="chat-room-settings-popup"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            form={form}
            onChange={changeFormHandler}
          >
            <div className="chat-room-settings-popup__image">
              <UIAvatarLoader
                path={imagePath}
                setImage={setNewImagePath}
                setFile={setFile}
                stubIconName="image-stub"
                shape="square"
              />
            </div>
            <div className="chat-room-settings-popup__chat-name">
              <Form.Item name="chat-name" rules={validateRules.required} initialValue={chatRoomData.chatName}>
                <UIInput placeholder="Chat-name" />
              </Form.Item>
            </div>
            <Members />
            <UIButton text="Update" border="border-default" htmltype={'submit'} disabled={!isValid} />
          </Form>
        </div>
      ) : (
        <div className="chat-room-settings-popup__wrapper">
          <div className="chat-room-settings-popup__image">
            <UIAvatar
              src={chatRoomData?.avatarPath}
              stubIconName="image-stub"
              showBadge={false}
              size="large"
              shape="square"
            />
          </div>
          <Members />
          <UIButton text="Close" border="border-default" onClick={() => dispatch(closeModal())} loading={isLoading} />
        </div>
      )}
    </div>
  )
}

export default ChatRoomSettingsPopup
