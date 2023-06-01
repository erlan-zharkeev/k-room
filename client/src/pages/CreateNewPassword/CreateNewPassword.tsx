import { Form } from 'antd'
import { RouteNames, Status } from 'common-types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AsyncThunkResponseWrapper } from 'src/@types'
import ErrorBucket from 'src/components/Common/ErrorBucket/ErrorBucket'
import { Logo } from 'src/components/Common/Logo/Logo'
import UIButton from 'ui/UIButton'
import UIInput from 'ui/UIInput'
import useValidate from 'src/hooks/useValidate'
import apiMethods from 'src/services/api-methods'
import { AppDispatch } from 'src/store'
import validateRules from 'src/utils/validateRules'

export const CreateNewPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const [isValid, validate] = useValidate()
  const [searchParams] = useSearchParams()
  const [passwordRestoreQuery, setPasswordRestoreQuery] = useState('')
  const [additionalErrors, setAdditionalErrors] = useState([] as Array<string>)
  const [isPasswordEqual, setIsPasswordEqual] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

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
    const response = (await dispatch(apiMethods.user.resetPassword(payload))) as AsyncThunkResponseWrapper
    setIsLoading(false)
    const { status } = response.payload
    if (status === Status.SUCCESS) navigate(RouteNames.SIGN_IN)
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
            name="sign-in"
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

            {additionalErrors && <ErrorBucket errors={additionalErrors} />}

            <Form.Item className="sign-in__controls">
              <UIButton
                text="Change password"
                border="border-default"
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

export default CreateNewPassword
