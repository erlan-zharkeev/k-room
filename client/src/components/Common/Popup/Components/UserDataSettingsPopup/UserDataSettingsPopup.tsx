import { Form } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import { validateRules } from 'src/utils/validateRules'
import apiMethods from 'src/services/api-methods'
import { AsyncThunkResponseWrapper } from 'src/@types'
import { setUserData } from 'src/store/userSlice'
import { User } from 'common-types'
import { UIAvatarLoader, UIInput, UIButton } from 'src/components/UI'

const UserDataSettingsPopup = () => {
  const { avatarPath, username, id } = useTypedSelector((state) => state.user.userData)
  const [imageChanged, setImageChanged] = useState(false)
  const [newAvatar, setNewAvatar] = useState<string | undefined>(avatarPath)

  const [isLoading, setIsLoading] = useState(false)
  const [isUsernameEqualNewName, setIsUsernameEqualNewName] = useState(true)

  const [avatarFile, setFile] = useState()

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()

  const imageUpdated = () => {
    setImageChanged(true)
  }

  useEffect(() => {
    setNewAvatar(avatarPath)
  }, [])

  const onFinish = async (values: User) => {
    const updatedUserData = {
      ...values,
      userId: id,
      oldFilename: avatarPath?.split('?img=')[1],
      file: avatarFile
    }
    setIsLoading(true)
    const response = (await dispatch(apiMethods.user.updateUserData(updatedUserData))) as AsyncThunkResponseWrapper
    dispatch(setUserData(response.payload.data.userData))
    setIsLoading(false)
    dispatch(closeModal())
  }

  const changeFormHandler = () => {
    validate(form)
    setIsUsernameEqualNewName(form.getFieldValue('username') === username)
  }

  const isUpdateButtonAvailable = () => {
    const isTextFieldValid = isValid && !isUsernameEqualNewName
    return imageChanged || isTextFieldValid
  }
  return (
    <div className="user-data-settings-popup">
      <Form
        name="update-user-data"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        onChange={changeFormHandler}
      >
        <div className="user-data-settings-popup__image">
          <UIAvatarLoader path={newAvatar} setImage={setNewAvatar} setFile={setFile} updated={imageUpdated} />
        </div>
        <Form.Item name="username" rules={validateRules.username} initialValue={username}>
          <UIInput placeholder="Username" />
        </Form.Item>
        <Form.Item className="user-data-settings-popup__controls">
          <UIButton
            text="Update"
            border="border-default"
            htmltype={'submit'}
            disabled={!isUpdateButtonAvailable()}
            loading={isLoading}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserDataSettingsPopup
