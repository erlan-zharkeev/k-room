import './style.scss'
import { Form } from 'antd'
import { EventUpdateChatRoom, SocketActions } from 'common-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from 'src/shared/api'
import { AppAvatar, AppAvatarLoader, AppButton, AppInput } from 'src/shared/ui'
import { validateRules } from 'src/shared/utils'
import { AppDispatch } from 'src/app/store'
import { closeModal } from 'src/entities/system'
import { useTypedSelector, useValidate } from 'src/shared/lib'

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
    const updatedValues: EventUpdateChatRoom = {
      roomId: selectedChatRoomId,
      users: [id, ...userIds],
      chatName: values['chat-name'],
      avatarPath: imagePath ?? '',
      avatarFile
    }
    setIsLoading(true)

    socket.emit<SocketActions>('update-chat-room', updatedValues)
    socket.on<SocketActions>('room-data-updated', () => {
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
        <span className="paragraph-text ">Members:</span>
        <div className="chat-room-settings-popup__members-list">
          {chatRoomData?.users?.map((user) => (
            <div className="chat-room-settings-popup__member">
              <AppAvatar src={user.avatarPath} showBadge={false} />
              <span className="paragraph-text ">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const closeModalHandler = () => {
    dispatch(closeModal())
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
              <AppAvatarLoader
                path={imagePath}
                setImage={setNewImagePath}
                setFile={setFile}
                stubIconName="image-stub"
              />
            </div>
            <div className="chat-room-settings-popup__chat-name">
              <Form.Item name="chat-name" rules={validateRules.required} initialValue={chatRoomData.chatName}>
                <AppInput placeholder="Chat-name" value="" name="chat-name" />
              </Form.Item>
            </div>
            <Members />
            <AppButton text="Update" htmltype="submit" disabled={!isValid} />
          </Form>
        </div>
      ) : (
        <div className="chat-room-settings-popup__wrapper">
          <div className="chat-room-settings-popup__image">
            <AppAvatar src={chatRoomData?.avatarPath} stubIconName="image-stub" showBadge={false} size="large" />
          </div>
          <Members />
          <AppButton text="Close" onClick={closeModalHandler} loading={isLoading} />
        </div>
      )}
    </div>
  )
}
