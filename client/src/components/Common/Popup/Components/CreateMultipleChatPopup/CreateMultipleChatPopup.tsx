import { Form } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import { validateRules } from 'src/utils/validateRules'
import MultipleUserSelect from './Components/MultipleUserSelect/MultipleUserSelect'
import { AsideBarButtonName, SocketActions, SocketActionsPayload, UserShort } from 'common-types'
import { socket } from 'src/socket/socket'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { changeAsideTab, selectChatRoom } from 'src/store/settingsSlice'
import { UIAvatarLoader, UIInput, UIButton } from 'src/components/UI'

const CreateMultipleChatPopup = () => {
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
      authorId: id,
      chatName,
      avatarFile,
      multiple: true
    }
    socket.emit(SocketActions.CREATE_ROOM, payload)

    socket.on(SocketActions.ROOM_CREATED, (data) => {
      dispatch(changeAsideTab(AsideBarButtonName.chatList))
      setTimeout(() => {
        dispatch(selectChatRoom(data.roomId))
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
          <UIButton text="Create" border="border-default" htmltype="submit" disabled={!isValid} loading={isLoading} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateMultipleChatPopup
