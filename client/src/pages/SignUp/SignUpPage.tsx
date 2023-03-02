import { Form, Input } from 'antd'
import { Status, RouteNames } from 'common-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AuthNav } from 'src/components/Common/AuthNav/AuthNav'
import UIButton from 'ui/UIButton'
import UIInput from 'ui/UIInput'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { registration } from 'src/store/authSlice'
import validateRules from 'src/utils/validateRules'
const Logo = require('src/assets/img/Logo.svg') as string

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
      <div className="sign-in__logo">
        <img className="logo" src={Logo} alt="logo"></img>
      </div>
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
              <UIInput placeholder="Username" size="large" autoComplete="on" />
            </Form.Item>

            <Form.Item name="email" rules={validateRules.email}>
              <UIInput placeholder="Email" size="large" autoComplete="on" />
            </Form.Item>

            <Form.Item name="password" rules={validateRules.password}>
              <UIInput type="password" placeholder="Password" size="large" autoComplete="on" />
            </Form.Item>

            <Form.Item className="sign-up__controls">
              <UIButton
                text="Submit"
                border="borderless"
                color="accent"
                htmlType="submit"
                loading={isLoading}
                disabled={!isValid}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
