import Form from 'antd/lib/form'
import { UserCredential, Status, RouteNames } from 'common-types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AsyncThunkResponseWrapper } from 'src/@types'
import { Logo, AuthNav, UIInput, UISwitch, UIButton } from 'src/components'
import { useValidate } from 'src/hooks'
import { apiMethods } from 'src/services'
import { AppDispatch } from 'src/store'
import { clearCookie, validateRules } from 'src/utils'

export const SignUpPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()

  useEffect(() => {
    clearCookie()
  }, [])

  const onFinish = async (values: UserCredential) => {
    setIsLoading(true)
    const response = (await dispatch(apiMethods.auth.registration(values))) as AsyncThunkResponseWrapper
    setIsLoading(false)
    if (!response.payload) return
    const { data, status } = response.payload
    if (status !== Status.success) return
    navigate(
      `${RouteNames.WAIT_EMAIL_CONFIRM}?email=${data.email}&nextRequestTime=${data.timeNextRequest}&attempts=${data.attempts}`,
      {
        replace: true
      }
    )
  }

  return (
    <div className="page sign-up">
      <Logo />
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
            <Form.Item name="username" rules={validateRules.username}>
              <UIInput placeholder="Username" size="large" autoComplete="on" />
            </Form.Item>

            <Form.Item name="email" rules={validateRules.email}>
              <UIInput placeholder="Email" size="large" autoComplete="on" />
            </Form.Item>

            <Form.Item name="password" rules={validateRules.password}>
              <UIInput type="password" placeholder="Password" size="large" autoComplete="on" />
            </Form.Item>

            <div className="sign-up__privacy-policy">
              <Form.Item name="policy" rules={validateRules.policy}>
                <UISwitch id="privacy-policy" initValue={false} onText="Read" offText="Unread" onChange={() => {}} />
              </Form.Item>
              <div className="sign-up__privacy-policy-text paragraph-text paragraph-text--secondary">
                I have read and agree{' '}
                <a className="link" target="_blank" href={RouteNames.PRIVACY_POLICY} rel="noreferrer">
                  privacy policy
                </a>
              </div>
            </div>
            <Form.Item className="sign-up__controls">
              <UIButton
                text="Register"
                border="border-default"
                color="accent"
                htmltype="submit"
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
