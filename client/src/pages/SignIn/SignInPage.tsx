import { Button, Form, Input } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AuthNav } from 'src/components/Common/AuthNav/AuthNav'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { login } from 'src/store/authSlice'
import validateRules from 'src/utils/validateRules'

export const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()
  const onFinish = async (fields: FormData) => {
    setIsLoading(true)
    await dispatch(login(fields as any))
    setIsLoading(false)
  }

  return (
    <div className="page sign-in">
      <div className="sign-in__wrapper">
        <div className="sign-in__body">
          <AuthNav />
          <Form
            name="sign-in"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            form={form}
            onInput={() => validate(form)}
          >
            <Form.Item name="email" rules={validateRules.email}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="password" rules={validateRules.password}>
              <Input.Password placeholder="Password" autoComplete="on" />
            </Form.Item>

            <Form.Item className="sign-in__controls">
              <Button ghost type="primary" htmlType="submit" disabled={!isValid} loading={isLoading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
