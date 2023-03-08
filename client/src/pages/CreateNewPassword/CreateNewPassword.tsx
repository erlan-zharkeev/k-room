import { Form } from 'antd'
import { RouteNames } from 'common-types'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Logo } from 'src/components/Common/Logo/Logo'
import UIButton from 'src/components/UI/UIButton'
import UIInput from 'src/components/UI/UIInput'
import useValidate from 'src/hooks/useValidate'
import validateRules from 'src/utils/validateRules'

export const CreateNewPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const [isValid, validate] = useValidate()
  const [searchParams] = useSearchParams()
  const [passwordRestoreQuery, setPasswordRestoreQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setPasswordRestoreQuery(searchParams.get('password-restore'))
    if (!passwordRestoreQuery) navigate(RouteNames.MAIN)
  })

  const onFinish = () => {
    setIsLoading(true)
    //
    setIsLoading(false)
  }

  return (
    <div className="create-new-password page">
      <Logo />
      <div className="create-new-password__wrapper">
        <div className="create-new-password__body">
          <div className="header-text header-text--md header-text--accent">Create new password</div>
          <Form
            name="sign-in"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            form={form}
            onInput={() => validate(form)}
          >
            <Form.Item name="password-first" rules={validateRules.password}>
              <UIInput placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item name="password-second" rules={validateRules.password}>
              <UIInput placeholder="Confirm password" type="password" size="large" />
            </Form.Item>

            <Form.Item className="sign-in__controls">
              <UIButton
                text="Change password"
                border="border-default"
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

export default CreateNewPassword
