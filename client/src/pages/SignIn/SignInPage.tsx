import { Form } from 'antd'
import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AuthNav } from 'src/components/Common/AuthNav/AuthNav'
import useValidate from 'src/hooks/useValidate'
import { AppDispatch } from 'src/store'
import { commonSetUserDataHandler } from 'src/store/userSlice'
import { validateRules } from 'src/utils/validateRules'
import { FirebaseProviderType } from 'src/hooks/useFirebase'
import { RouteNames, UserCredential } from 'common-types'
import { Logo } from 'src/components/Common/Logo/Logo'
import { useNavigate } from 'react-router-dom'
import { AsyncThunkResponseWrapper } from 'src/@types'
import apiMethods from 'src/services/api-methods'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { UIIcon, UIInput, UIButton } from 'src/components/UI'
import { AdditionalServiceContext } from 'src/providers/AdditionalServiceProvider'

const SignInPage = () => {
  const { firebase } = useContext(AdditionalServiceContext)
  const [isLoading, setIsLoading] = useState(false)
  const [googleBtnLoading, setGoogleBtnLoading] = useState(false)
  const [fbBtnLoading, setFbBtnLoading] = useState(false)

  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm()

  const [isValid, validate] = useValidate()

  const onFinish = async (fields: UserCredential) => {
    setIsLoading(true)
    const response = (await dispatch(apiMethods.auth.login(fields))) as AsyncThunkResponseWrapper
    setIsLoading(false)
    const { userData, settings } = response.payload.data
    commonSetUserDataHandler(dispatch, { userData, settings })
  }

  const providerSignIn = async (providerName: FirebaseProviderType, loaderMethod: (value: boolean) => void) => {
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
    const response = (await dispatch(apiMethods.auth.signInWithProvider(credential))) as AsyncThunkResponseWrapper
    loaderMethod(false)
    const { userData, settings } = response.payload.data
    commonSetUserDataHandler(dispatch, { userData, settings })
  }

  const { isAppLoading } = useTypedSelector((state) => state.user)

  return (
    <div className="page sign-in">
      {isAppLoading ? (
        <div className="sign-in__loader">
          <div className="sign-in__loader-content">
            <UIIcon name="loader" color="accent" size="large" />
            <h3 className="header-text header-text--md">Loading</h3>
          </div>
        </div>
      ) : (
        <>
          <Logo />
          <div className="sign-in__wrapper">
            <div className="sign-in__body">
              <AuthNav />
              <div className="sign-in__form"></div>
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
                    onClick={() => providerSignIn(FirebaseProviderType.google, setGoogleBtnLoading)}
                    loading={googleBtnLoading}
                  />
                  <UIButton
                    iconName="facebook"
                    text="Sign in with Facebook"
                    onClick={() => providerSignIn(FirebaseProviderType.facebook, setFbBtnLoading)}
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

                <div className="sign-in__controls">
                  <UIButton
                    text="Sign in"
                    border="border-default"
                    color="accent"
                    htmltype="submit"
                    loading={isLoading}
                    disabled={!isValid}
                    onClick={() => onFinish(form.getFieldsValue())}
                  />
                </div>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SignInPage
