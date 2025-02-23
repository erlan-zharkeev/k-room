import './style.scss'
import Form from 'antd/lib/form'
import { UserCredential, RouteNames, AuthEndpoints } from 'common-types'
import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useApi } from 'src/shared/api'
import { Input, Button } from 'src/shared/ui'
import { validateRules } from 'src/shared/utils'
import { AppDispatch } from 'src/app/store'
import { AdditionalServiceContext } from 'src/shared/providers'
import { AuthLayout } from 'src/app/view'
import { commonSetUserDataHandler } from 'src/entities/user'
import { FirebaseProvider } from 'src/app/providers/hooks/use-firebase'
import { useValidate } from 'src/shared/lib'

export const SignIn = () => {
  const { firebase } = useContext(AdditionalServiceContext)
  const [isLoading, setIsLoading] = useState(false)
  const [googleBtnLoading, setGoogleBtnLoading] = useState(false)
  const navigate = useNavigate()
  const { doRequest } = useApi()
  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()

  const onFinish = async (fields: UserCredential) => {
    setIsLoading(true)
    const response = await doRequest('post', AuthEndpoints.Login, fields)
    setIsLoading(false)
    const data = response?.data
    if (!data) return
    const { userData, settings } = data
    commonSetUserDataHandler(dispatch, { userData, settings })
  }

  const providerSignIn = async (providerName: FirebaseProvider, loaderMethod: (value: boolean) => void) => {
    loaderMethod(true)
    const result = await firebase.current.signIn(providerName)
    if (!result) return loaderMethod(false)
    const { displayName, email, photoURL, uid } = result.user
    const { providerId } = result
    const haveFullData = displayName && email && photoURL && uid && providerId
    if (!haveFullData) return
    const credential: UserCredential = {
      id: uid,
      username: displayName,
      email,
      avatarPath: photoURL,
      providerName: providerId
    }

    const response = await doRequest('post', AuthEndpoints.ProviderLogin, credential)
    loaderMethod(false)
    if (!response) return
    const { userData, settings } = response.data
    commonSetUserDataHandler(dispatch, { userData, settings })
  }

  return (
    <AuthLayout>
      <Form
        className="sign-in"
        name="sign-in"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        onInput={() => validate(form)}
      >
        <Form.Item name="email" rules={validateRules.email}>
          <Input placeholder="Email" size="large" autoComplete="on" />
        </Form.Item>
        <Form.Item name="password" rules={validateRules.password}>
          <Input type="password" placeholder="Password" size="large" autoComplete="on" />
        </Form.Item>
        <div className="sign-in-form__additional__links">
          <Button
            iconName="google"
            text="Sign in with Google"
            border="common-border"
            fill={true}
            hover="hoverless"
            onClick={() => providerSignIn('google', setGoogleBtnLoading)}
            loading={googleBtnLoading}
          />
          <div className="sign-in__forgot-password">
            <a className="paragraph-text link" onClick={() => navigate(RouteNames.PASSWORD_RECOVERY)}>
              Forgot password?
            </a>
          </div>
        </div>
        <div className="sign-in__controls">
          <Button
            text="Sign in"
            border="common-border"
            color="accent"
            htmltype="submit"
            loading={isLoading}
            disabled={!isValid}
            onClick={() => onFinish(form.getFieldsValue())}
          />
        </div>
      </Form>
    </AuthLayout>
  )
}
