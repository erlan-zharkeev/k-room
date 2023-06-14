import { Form } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import UIButton from 'src/components/UI/UIButton/UIButton'
import UIImageLoader from 'src/components/UI/UIImageLoader/UIImageLoader'
import UIInput from 'src/components/UI/UIInput/UIInput'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import validateRules from 'src/utils/validateRules'
import MultipleUserSelect from './Components/MultipleUserSelect/MultipleUserSelect'
import { SocketActions, UserShort } from 'common-types'
import { socket } from 'src/socket/socket'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { changeAsideTab, selectChatRoom } from 'src/store/settingsSlice'

const CreateMultipleChatPopup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useTypedSelector((state) => state.user.userData)
  const { contacts } = useTypedSelector((state) => state.contacts)

  const dispatch = useDispatch<AppDispatch>()
  const [isValid, validate] = useValidate()
  const [imagePath, setNewImagePath] = useState<string | undefined>()
  const [avatarFile, setFile] = useState()

  const [form] = Form.useForm()
  const [members, setMembers] = useState([] as Array<UserShort>)

  const prepareUsersArray = (ids: Array<string>) => {
    return ids.reduce((acc, id) => {
      const user = contacts.find((contact) => contact.id === id)
      const transformedUserObject = {
        id,
        username: user?.username ?? '',
        avatar: user?.avatar ?? ''
      }
      acc.push(transformedUserObject)
      return acc
    }, [] as Array<UserShort>)
  }

  const onFinish = async (values: { 'chat-name': string }) => {
    const chatName = values['chat-name']
    setIsLoading(true)
    const membersIds = members.map((member) => member.id)
    const users = prepareUsersArray([id, ...membersIds])

    socket.emit(SocketActions.CREATE_ROOM, { users, authorId: id, chatName, avatarFile, multiple: true })

    socket.on(SocketActions.ROOM_CREATED, (data) => {
      dispatch(changeAsideTab('chatList'))
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
          <UIImageLoader
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
