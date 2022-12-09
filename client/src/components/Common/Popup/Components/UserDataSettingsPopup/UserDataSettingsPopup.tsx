import { Button, Image, Form, Input, Avatar } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useValidate from '../../../../../hooks/useValidate'
import { AppDispatch } from '../../../../../store'
import validateRules from '../../../../../utils/validateRules'
import { UserOutlined } from '@ant-design/icons'
import { updateUserData } from '../../../../../store/authSlice'
import useTypedSelector from '../../../../../hooks/useTypedSelector'
import { showNotification, closeModal } from '../../../../../store/systemSlice'

const UserDataSettingsPopup = () => {
  const { avatar, username, id } = useTypedSelector((state) => state.auth.userData)

  const [newAvatar, setNewAvatar] = useState<string | undefined>()

  const [isLoading, setIsLoading] = useState(false)

  const [avatarFile, setFile] = useState()

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()

  const normFile = (e: any) => {
    const file = e.target.files[0]
    setFile(file)
    if (!file) return
    imageToBase64(file)
  }

  const imageToBase64 = (file: any) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const warnings = []

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) warnings.push('image resolution must be png or jpg')
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) warnings.push('image resolution must be less than 2mb')

    if (warnings.length) {
      warnings.forEach((warning) => {
        dispatch(showNotification({ message: warning, messageType: 'warning' }))
      })
      return
    }

    reader.onload = () => {
      setNewAvatar(String(reader.result))
    }

    reader.onerror = (error) => {
      // check error is object object
      console.log(error)
      // dispatch(showNotification({ message: `Cant convert image: ${error}`, messageType: 'error' }))
    }
  }

  const onFinish = async (values: FormData) => {
    const updatedUserData = {
      ...values,
      userId: id,
      file: avatarFile
    }
    setIsLoading(true)
    await dispatch(updateUserData(updatedUserData as any))
    setIsLoading(false)
    dispatch(closeModal())
  }

  return (
    <div className="user-data-settings-popup">
      <Form
        name="update-user-data"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        onInput={() => validate(form)}
      >
        <div className="user-data-settings-popup__avatar">
          {avatar || newAvatar ? (
            <Image preview={false} src={newAvatar ?? avatar} />
          ) : (
            <Avatar size="large" icon={<UserOutlined />} />
          )}
          <input type="file" onChange={normFile} />
        </div>

        <Form.Item name="username" rules={validateRules.required} initialValue={username}>
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item className="user-data-settings-popup__controls">
          <Button ghost type="primary" htmlType="submit" disabled={!isValid} loading={isLoading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserDataSettingsPopup
