import { Form } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AuthNav } from 'src/components/Common/AuthNav/AuthNav'
import UIButton from 'ui/UIButton'
import UIInput from 'ui/UIInput'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { login, signInWithProvider } from 'src/store/userSlice'
import validateRules from 'src/utils/validateRules'
import firebase, { ProviderType } from 'src/services/$firebase'
import { RouteNames } from 'common-types'
import { Logo } from 'src/components/Common/Logo/Logo'
import { useNavigate } from 'react-router-dom'

export const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [googleBtnLoading, setGoogleBtnLoading] = useState(false)
  const [fbBtnLoading, setFbBtnLoading] = useState(false)
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()
  const onFinish = async (fields: FormData) => {
    setIsLoading(true)
    await dispatch(login(fields as any))
    setIsLoading(false)
  }

  const providerSignIn = async (providerName: ProviderType, loaderMethod: (value: boolean) => void) => {
    loaderMethod(true)
    const result = await firebase.signIn(providerName)
    if (!result) return loaderMethod(false)
    const { displayName, email, photoURL, uid } = result.user
    const { providerId } = result
    const credential = {
      id: uid,
      username: displayName,
      email,
      avatar: photoURL,
      providerId
    }
    await dispatch(signInWithProvider(credential))
    loaderMethod(false)
  }

  return (
    <div className="page sign-in">
      <Logo />
      <div className="sign-in__wrapper">
        <div className="sign-in__body">
          <AuthNav />
          <Form
            name="sign-in"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            form={form}
            onInput={() => validate(form)}
          >
            <Form.Item name="email" rules={validateRules.email}>
              <UIInput placeholder="Email" size="large" autoComplete="on" />
            </Form.Item>

            <Form.Item name="password" rules={validateRules.password}>
              <UIInput type="password" placeholder="Password" size="large" autoComplete="on" />
            </Form.Item>

            <div className="sign-in__additional__links">
              <UIButton
                iconName="google"
                text="Sign in with Google"
                border="border-default"
                fill={true}
                hover="hoverless"
                onClick={() => providerSignIn('google', setGoogleBtnLoading)}
                loading={googleBtnLoading}
              />
              <UIButton
                iconName="facebook"
                text="Sign in with Facebook"
                onClick={() => providerSignIn('facebook', setFbBtnLoading)}
                border="border-default"
                fill={true}
                hover="hoverless"
                loading={fbBtnLoading}
              />
              <div className="sign-in__forgot-password">
                <a className="paragraph-text link" onClick={() => navigate(RouteNames.PASSWORD_RECOVERY)}>
                  Forgot password?
                </a>
              </div>
            </div>

            <Form.Item className="sign-in__controls">
              <UIButton
                text="Sign in"
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

export default SignInPage
