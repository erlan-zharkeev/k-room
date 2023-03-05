import { Form } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Logo } from 'src/components/Common/Logo/Logo'
import UIButton from 'src/components/UI/UIButton'
import UIInput from 'src/components/UI/UIInput'
import useValidate from 'src/hooks/useValidate'
import { sendEmailCodePasswordRecovery } from 'src/services/api-methods/sendCodes'
import { AppDispatch } from 'src/store'
import validateRules from 'src/utils/validateRules'

export const PasswordRecoveryPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, validate] = useValidate()
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()

  const onFinish = async (fields: FormData) => {
    setIsLoading(true)
    await dispatch(sendEmailCodePasswordRecovery(fields))
    setIsLoading(false)
  }

  return (
    <div className="password-recovery page">
      <Logo />
      <div className="password-recovery__wrapper">
        <div className="password-recovery__body">
          <div className="header-text header-text--md">Password recovery</div>
          <div className="password-recovery__content">
            <Form
              name="password-recovery"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              form={form}
              onInput={() => validate(form)}
            >
              <Form.Item name="email" rules={validateRules.email}>
                <UIInput placeholder="Enter email address" size="large" autoComplete="on" />
              </Form.Item>

              <Form.Item className="sign-in__controls">
                <UIButton
                  text="Send code"
                  border="default"
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
    </div>
  )
}

export default PasswordRecoveryPage
