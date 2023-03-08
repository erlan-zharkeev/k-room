import { Form } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Logo } from 'src/components/Common/Logo/Logo'
import UIButton from 'src/components/UI/UIButton'
import UIInput from 'src/components/UI/UIInput'
import useValidate from 'src/hooks/useValidate'
import { sendEmailCodePasswordRecovery, validateEmailCodePasswordRecovery } from 'src/services/api-methods/sendCodes'
import { AppDispatch } from 'src/store'
import validateRules from 'src/utils/validateRules'
import getNextReqInterval from 'src/utils/getNextReqInterval'
import UseCounter from 'src/hooks/useCounter'
import { CodeValidationPayload, RouteNames } from 'common-types'
import { useNavigate } from 'react-router-dom'

export const PasswordRecoveryPage = () => {
  const [emailSendCodeIsLoading, setEmailSendCodeIsLoading] = useState(false)
  const [codeValidationIsLoading, setCodeValidationIsLoading] = useState(false)

  const [isEmailValid, validateEmailConfirm] = useValidate()
  const [isCodeValid, validateCode] = useValidate()

  const [codeSent, setCodeAsSent] = useState(false)

  const [emailConfirmForm] = Form.useForm()
  const [codeConfirmForm] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const [counterValue, setCounterValue, startCounter, stopCounter] = UseCounter(-1)

  const navigate = useNavigate()

  const onFinishEmailConfirm = async (fields: FormData) => {
    stopCounter()
    setEmailSendCodeIsLoading(true)
    const response = await dispatch(sendEmailCodePasswordRecovery(fields))
    if (!response) return
    setCodeAsSent(true)
    const { nextTimeRequest } = response.payload
    setCounterValue(Math.round(getNextReqInterval(nextTimeRequest)))
    startCounter()
    setEmailSendCodeIsLoading(false)
  }

  const onFinishCodeConfirm = async (fields: { code: string }) => {
    setCodeValidationIsLoading(true)
    const payload: CodeValidationPayload = {
      email: emailConfirmForm.getFieldValue('email'),
      code: fields.code
    }
    const response = await dispatch(validateEmailCodePasswordRecovery(payload))
    if (!response) return
    const { query } = response.payload
    setCodeValidationIsLoading(false)
    navigate({ pathname: RouteNames.CREATE_NEW_PASSWORD, search: `?password-restore=${query}` })
  }

  return (
    <div className="password-recovery page">
      <Logo />
      <div className="password-recovery__wrapper">
        <div className="password-recovery__body">
          <div className="header-text header-text--md header-text--accent">Password recovery</div>
          <div className="password-recovery__content">
            <Form
              className="password-recovery__email-confirm"
              name="password-recovery"
              initialValues={{ remember: true }}
              onFinish={onFinishEmailConfirm}
              form={emailConfirmForm}
              onInput={() => validateEmailConfirm(emailConfirmForm)}
            >
              <Form.Item name="email" className="password-recovery__email-field" rules={validateRules.email}>
                <UIInput
                  placeholder="Enter email address"
                  size="large"
                  autoComplete="on"
                  disabled={emailSendCodeIsLoading}
                />
              </Form.Item>

              {counterValue > 0 && (
                <span className="paragraph-text paragraph-text--secondary password-recovery__next-request">
                  The next request is possible in {counterValue} sec.
                </span>
              )}
              <Form.Item className="password-recovery__email-submit">
                <UIButton
                  fill={true}
                  text="Send code"
                  border="border-default"
                  color="accent"
                  htmlType="submit"
                  loading={emailSendCodeIsLoading}
                  disabled={!isEmailValid || counterValue > 0}
                />
              </Form.Item>
            </Form>
            {codeSent && (
              <Form
                className="password-recovery__code-validation"
                name="password-recovery"
                onFinish={onFinishCodeConfirm}
                form={codeConfirmForm}
                onInput={() => validateCode(codeConfirmForm)}
              >
                <Form.Item name="code" className="password-recovery__code-field" rules={validateRules.emailCode}>
                  <UIInput placeholder="Enter code" size="large" autoComplete="on" disabled={codeValidationIsLoading} />
                </Form.Item>

                <Form.Item className="password-recovery__code-submit">
                  <UIButton
                    fill={true}
                    text="Validate"
                    border="border-default"
                    color="success"
                    htmlType="submit"
                    loading={codeValidationIsLoading}
                    disabled={!isCodeValid}
                  />
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordRecoveryPage
