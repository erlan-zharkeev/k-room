import { Form } from 'antd'
import { User } from 'firebase/auth'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import UIButton from 'ui/UIButton'
// import UIImageLoader from 'ui/UIImageLoader'
import UIInput from 'ui/UIInput'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import validateRules from 'src/utils/validateRules'
// import MultipleUserSelect from './Components/MultipleUserSelect/MultipleUserSelect'

export const CreateMultipleChatPopup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [isValid, validate] = useValidate()
  // const [image, setNewImage] = useState(null)
  const [form] = Form.useForm()
  // const [imageFile, setImageFile] = useState()
  // const [members, setMembers] = useState([])

  const onFinish = async (values: User) => {
    console.log(values)
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
          {/* <UIImageLoader image={image} setImage={setNewImage} setFile={setImageFile} stubIconName="image" /> */}
        </div>
        <Form.Item name="chat-name" rules={validateRules.required}>
          <UIInput placeholder="Enter chat name" />
        </Form.Item>
        {/* <MultipleUserSelect setMembers={setMembers} /> */}
        <Form.Item className="create-multiple-chat-popup__controls">
          <UIButton text="Create" border="border-default" htmltype="submit" disabled={!isValid} loading={isLoading} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateMultipleChatPopup
