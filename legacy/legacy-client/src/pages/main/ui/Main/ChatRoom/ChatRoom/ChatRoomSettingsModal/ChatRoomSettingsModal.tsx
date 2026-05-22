import './chat-room-settings-modal.scss'
import { useState } from 'react'

import { Form } from 'antd'

import { EventUpdateChatRoom, MediaFileValue, SocketActions } from 'common'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { useSettings, useI18n } from 'src/shared/preferences'
import { AppAvatar, AppAvatarLoader, AppButton, AppHeader } from 'src/shared/ui'

import { CHAT_ROOM_SETTINGS_MODAL_I18N } from './i18n.ts'
import { ChatRoomSettingsModalProps } from './chat-room-settings-modal.types.ts'

// import { validateRules } from 'src/shared/lib'

export const ChatRoomSettingsModal = ({ onClose }: ChatRoomSettingsModalProps) => {
  const { chatRooms } = useChatRoom()
  const { getByIds } = useContact()
  const { selectedChatRoomId } = useSettings()
  const { id } = useUser()
  const chatRoomData = chatRooms.find((room) => room.id === selectedChatRoomId)
  const members = chatRoomData ? getByIds(chatRoomData.users) : []
  const [imagePath, setNewImagePath] = useState<string | null | undefined>(chatRoomData?.avatarId)
  const [avatarFile, setFile] = useState<File | MediaFileValue | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isUserAuthor = chatRoomData?.authorId === id
  const { t } = useI18n()

  const [form] = Form.useForm()
  // const [isValid, validate] = useValidate()

  const onFinish = async (values: { 'chat-name': string }) => {
    const userIds = chatRoomData?.users ?? []
    const updatedValues: EventUpdateChatRoom = {
      roomId: selectedChatRoomId,
      users: userIds,
      chatName: values['chat-name'],
      avatar: imagePath ?? '',
      avatarFile: avatarFile as EventUpdateChatRoom['avatarFile']
    }
    setIsLoading(true)

    socket.emit<SocketActions>('update-chat-room', updatedValues)
    socket.once<SocketActions>('room-data-updated', () => {
      setIsLoading(false)
      onClose()
    })
  }

  const changeFormHandler = () => {
    // validate(form)
  }

  const Members = () => {
    return (
      <div className="chat-room-settings-modal__members">
        <span className="paragraph-text ">{t(CHAT_ROOM_SETTINGS_MODAL_I18N.members)}</span>
        <div className="chat-room-settings-modal__members-list">
          {members.map((user) => (
            <div className="chat-room-settings-modal__member" key={user.id}>
              <AppAvatar src={`avatar.${user.id}`} showBadge={false} />
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
        <AppHeader tag="h4" bold={false}>
          {chatRoomData?.chatName}
        </AppHeader>
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
            <AppAvatar src={chatRoomData?.avatarId} stubIconName="image-stub" showBadge={false} size="large" />
          </div>
          <Members />
          <AppButton text={t(CHAT_ROOM_SETTINGS_MODAL_I18N.close)} onClick={onClose} loading={isLoading} />
        </div>
      )}
    </div>
  )
}
