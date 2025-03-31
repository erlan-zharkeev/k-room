import './style.scss'
import { Form } from 'antd'
import { UserShortType, SocketActionsType, IEventCreateRoom, IEventRoomCreated } from 'common-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector, useValidate } from 'src/shared/lib'
import { AppDispatch } from 'src/app/store'
import { socket } from 'src/shared/api'
import { AppAvatarLoader, AppInput, AppButton } from 'src/shared/ui'
import { validateRules } from 'src/shared/utils'
import { closeModal } from 'src/entities/system'
import { useSettings } from 'src/entities/settings'
import { SelectUsers } from 'src/features/select-users'

export const CreateMultipleChatPopup = () => {
  const { updateSetting } = useSettings()

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

    socket.on<SocketActionsType>('room-created', (data: IEventRoomCreated) => {
      updateSetting('selectedContentElement', { selectedContentElement: 'chat-list' })

      setTimeout(() => {
        updateSetting('selectedChatRoomId', { selectChatRoomId: data.roomId })
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
