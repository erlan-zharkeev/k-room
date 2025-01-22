import { Form } from 'antd'
import { SocketActionsPayload, SocketActions } from 'common-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { UIAvatar, UIAvatarLoader, UIInput, UIButton } from 'src/components'
import { useTypedSelector, useValidate } from 'src/hooks'
import { $socket } from 'src/services'
import { AppDispatch, closeModal } from 'src/store'
import { validateRules } from 'src/utils'

export const ChatRoomSettingsPopup = () => {
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
    const updatedValues: SocketActionsPayload['updateChatRoom'] = {
      roomId: selectedChatRoomId,
      users: [id, ...userIds],
      chatName: values['chat-name'],
      avatarPath: imagePath ?? '',
      avatarFile
    }
    setIsLoading(true)

    $socket.emit(SocketActions.UPDATE_CHAT_ROOM, updatedValues)
    $socket.on(SocketActions.ROOM_DATA_UPDATED, () => {
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
            <UIButton text="Update" border="common-border" htmltype="submit" disabled={!isValid} />
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
          <UIButton text="Close" border="common-border" onClick={() => dispatch(closeModal())} loading={isLoading} />
        </div>
      )}
    </div>
  )
}
