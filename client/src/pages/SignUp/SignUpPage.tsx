import { Button, Form, Input } from 'antd'
import { RouteNames, Status } from './../../../../types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AuthNav } from '../../components/Common/AuthNav/AuthNav'
import useValidate from '../../hooks/useValidate'
import { AppDispatch } from '../../store'
import { registration } from '../../store/authSlice'
import validateRules from '../../utils/validateRules'

export const SignUpPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()

  const onFinish = async (values: FormData) => {
    setIsLoading(true)
    const response = await dispatch(registration(values as any))
    setIsLoading(false)
    if (!response.payload) return
    const { data, status } = response.payload as any
    if (status !== Status.SUCCESS) return
    navigate(
      `${RouteNames.WAIT_EMAIL_CONFIRM}?email=${data.email}&nextRequestTime=${data.timeNextRequest}&attempts=${data.attempts}`,
      {
        replace: true
      }
    )
  }

  return (
    <div className="page sign-up">
      <div className="sign-up__wrapper">
        <div className="sign-up__body">
          <AuthNav />
          <Form
            name="sign-up"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
            onInput={() => validate(form)}
          >
            <Form.Item name="username" rules={validateRules.required}>
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item name="email" rules={validateRules.email}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="password" rules={validateRules.password}>
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item className="sign-up__controls">
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

export default SignUpPage
