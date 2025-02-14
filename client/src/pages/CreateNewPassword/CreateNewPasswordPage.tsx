import Form from 'antd/lib/form'
import { RouteNames, Status, UserEndpoints } from 'common-types'
import { useState, useEffect } from 'react'
import { Logo, UIInput, ErrorBucket, UIButton } from 'src/components'
import { useValidate } from 'src/hooks'
import { validateRules } from 'src/utils'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApi } from 'src/services'

export const CreateNewPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const [isValid, validate] = useValidate()
  const [searchParams] = useSearchParams()
  const [passwordRestoreQuery, setPasswordRestoreQuery] = useState('')
  const [additionalErrors, setAdditionalErrors] = useState<Array<string>>([])
  const [isPasswordEqual, setIsPasswordEqual] = useState(false)
  const navigate = useNavigate()
  const { doRequest } = useApi()

  useEffect(() => {
    const passwordRestoreQuery = searchParams.get('password-recovery')
    if (!passwordRestoreQuery) return navigate(RouteNames.MAIN)
    setPasswordRestoreQuery(passwordRestoreQuery)
  })

  const onFinish = async () => {
    setIsLoading(true)
    const payload = {
      password: form.getFieldsValue()['password-first'],
      query: passwordRestoreQuery
    }
    const response = await doRequest('post', UserEndpoints.ResetPassword, payload)
    setIsLoading(false)
    if (response && response.status === Status.Success) navigate(RouteNames.SIGN_IN)
  }

  const formChangeHandler = () => {
    setIsPasswordEqual(false)
    validate(form)
    if (!isValid) return
    const passwordFirst = form.getFieldsValue()['password-first']
    const passwordSecond = form.getFieldsValue()['password-second']
    const isFieldsEqual = passwordFirst === passwordSecond
    setIsPasswordEqual(isFieldsEqual)
    const errors = isFieldsEqual ? [] : ['Password don`t match']
    setAdditionalErrors(errors)
  }

  return (
    <div className="create-new-password page">
      <Logo />
      <div className="create-new-password__wrapper">
        <div className="create-new-password__body">
          <div className="header-text header-text--md header-text--accent">Create new password</div>
          <Form
            name="create-new-password"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            form={form}
            onChange={formChangeHandler}
          >
            <Form.Item name="password-first" rules={validateRules.password}>
              <UIInput placeholder="Password" type="password" size="large" />
            </Form.Item>
            <Form.Item name="password-second" rules={validateRules.password}>
              <UIInput placeholder="Confirm password" type="password" size="large" />
            </Form.Item>
            {additionalErrors.length > 0 && <ErrorBucket errors={additionalErrors} />}
            <Form.Item className="create-new-password__controls">
              <UIButton
                text="Change password"
                border="common-border"
                color="accent"
                htmltype="submit"
                loading={isLoading}
                disabled={!isValid || !isPasswordEqual}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
