import './style.scss'
import Form from 'antd/lib/form'
import { UserCredential, Status, RouteNames, AuthEndpoints } from 'common-types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from 'src/app/view'
import { useApi } from 'src/shared/api'
import { useValidate } from 'src/shared/lib'
import { Input, Switch, Button } from 'src/shared/ui'
import { clearCookie, validateRules } from 'src/shared/utils'

export const SignUp = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()
  const { doRequest } = useApi()

  useEffect(() => {
    clearCookie()
  }, [])

  const onFinish = async (values: UserCredential) => {
    setIsLoading(true)
    const response = await doRequest('post', AuthEndpoints.Registration, values)
    setIsLoading(false)
    if (!response) return
    const { data, status } = response
    if (status !== Status.Success) return
    navigate(
      `${RouteNames.WAIT_EMAIL_CONFIRM}?email=${data.email}&nextRequestTime=${data.timeNextRequest}&attempts=${data.attempts}`,
      {
        replace: true
      }
    )
  }
  return (
    <AuthLayout>
      <Form
        className="sign-up"
        name="sign-up"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        onInput={() => validate(form)}
      >
        <Form.Item name="username" rules={validateRules.username}>
          <Input placeholder="Username" size="large" autoComplete="on" />
        </Form.Item>
        <Form.Item name="email" rules={validateRules.email}>
          <Input placeholder="Email" size="large" autoComplete="on" />
        </Form.Item>
        <Form.Item name="password" rules={validateRules.password}>
          <Input type="password" placeholder="Password" size="large" autoComplete="on" />
        </Form.Item>
        <div className="sign-up__privacy-policy">
          <Form.Item name="policy" rules={validateRules.policy}>
            <Switch id="privacy-policy" initValue={false} onText="Read" offText="Unread" onChange={() => {}} />
          </Form.Item>
          <div className="sign-up__privacy-policy-text paragraph-text paragraph-text--secondary">
            I have read and agree{' '}
            <a className="link" target="_blank" href={RouteNames.PRIVACY_POLICY} rel="noreferrer">
              privacy policy
            </a>
          </div>
        </div>
        <Form.Item className="sign-up__controls">
          <Button
            text="Register"
            border="common-border"
            color="accent"
            htmltype="submit"
            loading={isLoading}
            disabled={!isValid}
          />
        </Form.Item>
      </Form>
    </AuthLayout>
  )
}
