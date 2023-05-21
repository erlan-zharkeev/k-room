import { Form } from 'antd'
import { User } from 'firebase/auth'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import UIButton from 'src/components/UI/UIButton'
import UIImageLoader from 'src/components/UI/UIImageLoader'
import UIInput from 'src/components/UI/UIInput'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import validateRules from 'src/utils/validateRules'

export const CreateMultipleChatPopup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [isValid, validate] = useValidate()
  const [image, setNewImage] = useState(null)
  const [form] = Form.useForm()
  const [imageFile, setImageFile] = useState()

  const onFinish = async (values: User) => {
    setIsLoading(true)
    setIsLoading(false)
    dispatch(closeModal())
  }

  const changeFormHandler = () => {
    validate(form)
    // setIsUsernameEqualNewName(form.getFieldValue('username') === username)
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
          <UIImageLoader image={image} setImage={setNewImage} setFile={setImageFile} stubIconName="image" />
        </div>
        <Form.Item name="chat-name" rules={validateRules.required}>
          <UIInput placeholder="Enter chat name" />
        </Form.Item>
        <Form.Item className="create-multiple-chat-popup__controls">
          <UIButton text="Create" border="border-default" htmlType="submit" disabled={!isValid} loading={isLoading} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateMultipleChatPopup
