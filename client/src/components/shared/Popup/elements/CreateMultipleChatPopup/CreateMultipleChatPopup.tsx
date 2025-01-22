import { Form } from 'antd'
import { UserShort, SocketActionsPayload, SocketActions, UserSettingKey, AsideBarButtonName } from 'common-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { UIAvatarLoader, UIInput, UIButton } from 'src/components'
import { useUpdateSettings, useTypedSelector, useValidate } from 'src/hooks'
import { AppDispatch, closeModal } from 'src/store'
import { validateRules } from 'src/utils'
import { $socket } from 'src/services'
import { MultipleUserSelect } from './components/MultipleUserSelect/MultipleUserSelect'

export const CreateMultipleChatPopup = () => {
  const { updateSetting } = useUpdateSettings()

  const [isLoading, setIsLoading] = useState(false)
  const { id } = useTypedSelector((state) => state.user.userData)

  const dispatch = useDispatch<AppDispatch>()
  const [isValid, validate] = useValidate()
  const [imagePath, setNewImagePath] = useState<string | undefined>()
  const [avatarFile, setFile] = useState()

  const [form] = Form.useForm()
  const [members, setMembers] = useState([] as Array<UserShort>)

  const onFinish = async (values: { 'chat-name': string }) => {
    const chatName = values['chat-name']
    setIsLoading(true)
    const membersIds = members.map((member) => member.id)
    const payload: SocketActionsPayload['createRoom'] = {
      users: [id, ...membersIds],
      chatName,
      avatarFile,
      multiple: true
    }
    $socket.emit(SocketActions.CREATE_ROOM, payload)

    $socket.on(SocketActions.ROOM_CREATED, (data) => {
      updateSetting(UserSettingKey.asideTab, { asideTab: AsideBarButtonName.chatList })

      setTimeout(() => {
        updateSetting(UserSettingKey.selectedChatRoomId, { selectChatRoomId: data.roomId })
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
          <UIAvatarLoader
            path={imagePath}
            setImage={setNewImagePath}
            setFile={setFile}
            stubIconName="image-stub"
            shape="square"
          />
        </div>
        <Form.Item name="chat-name" rules={validateRules.required}>
          <UIInput placeholder="Enter chat name" />
        </Form.Item>
        <MultipleUserSelect setMembers={setMembers} />
        <Form.Item className="create-multiple-chat-popup__controls">
          <UIButton text="Create" border="common-border" htmltype="submit" disabled={!isValid} loading={isLoading} />
        </Form.Item>
      </Form>
    </div>
  )
}
