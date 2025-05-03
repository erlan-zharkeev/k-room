import './style.scss'
import { useState } from 'react'

import { Form } from 'antd'
import { UserShortType, SocketActionsType, IEventCreateRoom, IEventRoomCreated } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useContentTabSelect } from 'src/features/content-tab/select-content-tab'
import { useRoomSelect } from 'src/features/room'
import { SelectUsers } from 'src/features/select-users'

import { closeModal } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { useValidate } from 'src/shared/lib'
import { AppAvatarLoader, AppInput, AppButton } from 'src/shared/ui'
import { validateRules } from 'src/shared/utils'

export const CreateMultipleChatPopup = () => {
  const [isLoading, setIsLoading] = useState(false)
  // const { id } = useTypedSelector((state) => state.user.userData)

  const dispatch = useDispatch<AppDispatch>()
  const [isValid, validate] = useValidate()
  const [imagePath, setNewImagePath] = useState<string | undefined>()
  const [avatarFile, setFile] = useState()

  const [form] = Form.useForm()
  const [members, setMembers] = useState<UserShortType[]>([])

  const onFinish = async (values: { 'chat-name': string }) => {
    // const chatName = values['chat-name']
    setIsLoading(true)
    // const membersIds = members.map((member) => member.id)
    // const payload: IEventCreateRoom = {
    //   users: [id, ...membersIds],
    //   chatName,
    //   avatarFile,
    //   multiple: true
    // }
    // socket.emit<SocketActionsType>('create-personal-room', payload)
    const { selectRoomById } = useRoomSelect()
    const { selectContentTab } = useContentTabSelect()

    socket.on<SocketActionsType>('room-created', (data: IEventRoomCreated) => {
      selectContentTab('chat-list')
      setTimeout(() => {
        selectRoomById(data.roomId)
      })
      setIsLoading(false)
      dispatch(closeModal())
    })
  }

  const changeFormHandler = () => {
    validate(form)
  }

  return (
    <div className="create-multiple-chat-popup">
      <Form
        name="create-multiple-chat"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        onChange={changeFormHandler}
      >
        <div className="create-multiple-chat-popup__image">
          <AppAvatarLoader path={imagePath} setImage={setNewImagePath} setFile={setFile} stubIconName="image-stub" />
        </div>
        <SelectUsers setMembers={setMembers} />
        <Form.Item name="chat-name" rules={validateRules.required}>
          <AppInput placeholder="Enter chat name" value="" name="chat name" />
        </Form.Item>
        <Form.Item className="create-multiple-chat-popup__controls">
          <AppButton text="Create" borderless htmltype="submit" disabled={!isValid} loading={isLoading} />
        </Form.Item>
      </Form>
    </div>
  )
}
