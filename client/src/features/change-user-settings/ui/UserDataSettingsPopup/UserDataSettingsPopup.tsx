import './style.scss'
import { Form } from 'antd'
import { KRoomUser, UserEndpoints } from 'common-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector, useValidate } from 'src/shared/lib'
import { useApi } from 'src/shared/api'
import { AppAvatarLoader, AppInput, AppButton } from 'src/shared/ui'
import { validateRules } from 'src/shared/utils'
import { AppDispatch } from 'src/app/store'
import { closeModal } from 'src/entities/system'
import { setUserData } from 'src/entities/user'

export const UserDataSettingsPopup = () => {
  const { avatarPath, username } = useTypedSelector((state) => state.user.userData)
  const [imageChanged, setImageChanged] = useState(false)
  const [newAvatar, setNewAvatar] = useState<string | undefined>(avatarPath)

  const [isLoading, setIsLoading] = useState(false)
  const [isUsernameEqualNewName, setIsUsernameEqualNewName] = useState(true)

  const [avatarFile, setFile] = useState()

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()

  const { doRequest } = useApi()

  const imageUpdated = () => {
    setImageChanged(true)
  }

  useEffect(() => {
    setNewAvatar(avatarPath)
  }, [])

  const onFinish = async (values: KRoomUser) => {
    const updatedUserData = {
      ...values,
      oldFilename: avatarPath?.split('?img=')[1],
      file: avatarFile
    }
    setIsLoading(true)
    const response = await doRequest('post', UserEndpoints.UpdateUserData, updatedUserData, 'multipart/form-data')
    if (response?.data?.userData) {
      dispatch(setUserData(response.data.userData))
      setIsLoading(false)
      dispatch(closeModal())
    }
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
          <AppAvatarLoader path={newAvatar} setImage={setNewAvatar} setFile={setFile} updated={imageUpdated} />
        </div>
        <Form.Item name="username" rules={validateRules.username} initialValue={username}>
          <AppInput placeholder="Username" value="" name="username" />
        </Form.Item>
        <Form.Item className="user-data-settings-popup__controls">
          <AppButton text="Update" htmltype="submit" disabled={!isUpdateButtonAvailable()} loading={isLoading} />
        </Form.Item>
      </Form>
    </div>
  )
}
