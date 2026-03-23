import './style.scss'
import { useState, useEffect } from 'react'

import { Form } from 'antd'
import { IEventUpdateChatRoom, SocketActionsType } from 'common-types'

import { socket } from 'src/shared/api'
import { useTypedSelector } from 'src/shared/lib'
import { AppAvatar, AppAvatarLoader, AppButton } from 'src/shared/ui'
// import { validateRules } from 'src/shared/utils'

export const ChatRoomSettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.settings)
  const chatRoomData = chatRooms.find((room) => room.id === selectedChatRoomId)
  const { id } = useTypedSelector((state) => state.user.userData)
  const [imagePath, setNewImagePath] = useState<string | undefined>(chatRoomData?.avatar)
  const [avatarFile, setFile] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const isUserAuthor = chatRoomData?.authorId === id

  const [form] = Form.useForm()
  // const [isValid, validate] = useValidate()

  const onFinish = async (values: { 'chat-name': string }) => {
    const userIds = chatRoomData?.users.map((user) => user.id) ?? []
    const updatedValues: IEventUpdateChatRoom = {
      roomId: selectedChatRoomId,
      users: [id, ...userIds],
      chatName: values['chat-name'],
      avatar: imagePath ?? '',
      avatarFile
    }
    setIsLoading(true)

    socket.emit<SocketActionsType>('update-chat-room', updatedValues)
    socket.on<SocketActionsType>('room-data-updated', () => {
      setIsLoading(false)
      onClose()
    })
  }

  useEffect(() => {}, [])

  const changeFormHandler = () => {
    // validate(form)
  }

  const Members = () => {
    return (
      <div className="chat-room-settings-modal__members">
        <span className="paragraph-text ">Members:</span>
        <div className="chat-room-settings-modal__members-list">
          {chatRoomData?.users?.map((user) => (
            <div className="chat-room-settings-modal__member" key={user.id}>
              <AppAvatar src={user.avatar} showBadge={false} />
              <span className="paragraph-text ">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="chat-room-settings-modal">
      <div className="chat-room-settings-modal__title">
        <span className="header-text header-text--secondary header-text--lg">{chatRoomData?.chatName}</span>
      </div>
      {isUserAuthor ? (
        <div className="chat-room-settings-modal__wrapper">
          <Form
            name="chat-room-settings-modal"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            form={form}
            onChange={changeFormHandler}
          >
            <div className="chat-room-settings-modal__image">
              <AppAvatarLoader
                path={imagePath}
                setImage={setNewImagePath}
                setFile={setFile}
                stubIconName="image-stub"
              />
            </div>
            <div className="chat-room-settings-modal__chat-name">
              {/* <Form.Item name="chat-name" rules={validateRules.required} initialValue={chatRoomData.chatName}>
                <AppInput placeholder="Chat-name" value="" name="chat-name" />
              </Form.Item> */}
            </div>
            <Members />
            {/* <AppButton text="Update" htmltype="submit" disabled={!isValid} /> */}
          </Form>
        </div>
      ) : (
        <div className="chat-room-settings-modal__wrapper">
          <div className="chat-room-settings-modal__image">
            <AppAvatar src={chatRoomData?.avatar} stubIconName="image-stub" showBadge={false} size="large" />
          </div>
          <Members />
          <AppButton text="Close" onClick={onClose} loading={isLoading} />
        </div>
      )}
    </div>
  )
}
