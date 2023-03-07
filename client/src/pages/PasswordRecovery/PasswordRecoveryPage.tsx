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
import getNextReqInterval from 'src/utils/getNextReqInterval'
import UseCounter from 'src/hooks/useCounter'

export const PasswordRecoveryPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, validate] = useValidate()
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const [counterValue, setCounterValue, startCounter, stopCounter] = UseCounter(-1)

  const onFinish = async (fields: FormData) => {
    stopCounter()
    setIsLoading(true)
    const response = await dispatch(sendEmailCodePasswordRecovery(fields))
    if (!response) return
    const { nextTimeRequest } = response.payload
    setCounterValue(Math.round(getNextReqInterval(nextTimeRequest)))
    startCounter()
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
                <UIInput placeholder="Enter email address" size="large" autoComplete="on" disabled={isLoading} />
              </Form.Item>

              {counterValue > 0 && (
                <span className="paragraph-text paragraph-text--secondary">
                  The next request is possible in {counterValue} sec.
                </span>
              )}

              <Form.Item className="password-recovery__controls">
                <UIButton
                  text="Send code"
                  border="default"
                  color="accent"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={!isValid || counterValue > 0}
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
