import { UserCredentialType, AuthEndpointsEnum, AuthLoginPayloadType, StatusEnum, RouteNamesEnum } from 'common-types'
import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FirebaseProvider } from 'src/app'
import { AppDispatch } from 'src/app/store'
import { commonSetUserDataHandler } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { AdditionalServiceContext } from 'src/shared/providers'

export const useLogin = () => {
  const { firebase } = useContext(AdditionalServiceContext)
  const { doRequest } = useApi()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [googleBtnLoading, setGoogleBtnLoading] = useState(false)

  const login = async (fields: AuthLoginPayloadType) => {
    setIsLoading(true)
    const response = await doRequest('post', AuthEndpointsEnum.Login, fields)
    setIsLoading(false)
    if (response?.status === StatusEnum.Success && response.data) {
      const { userData, settings } = response.data
      commonSetUserDataHandler(dispatch, { userData, settings })
      navigate(RouteNamesEnum.Main)
    }
  }

  const onSubmit = (payload: unknown) => {
    const formData = payload as AuthLoginPayloadType
    login(formData)
  }

  const providerLogin = async (providerName: FirebaseProvider) => {
    setGoogleBtnLoading(true)
    const result = await firebase.current.login(providerName)
    const { displayName, email, photoURL, uid } = result.user
    const { providerId } = result
    const haveFullData = displayName && email && photoURL && uid && providerId
    if (!haveFullData) return
    const credential: UserCredentialType = {
      id: uid,
      username: displayName,
      email,
      avatarPath: photoURL,
      providerName: providerId
    }

    const response = await doRequest('post', AuthEndpointsEnum.ProviderLogin, credential)
    setGoogleBtnLoading(false)
    if (!response) return
    const { userData, settings } = response.data
    commonSetUserDataHandler(dispatch, { userData, settings })
  }

  return {
    login,
    isLoading,
    providerLogin,
    googleBtnLoading,
    onSubmit
  }
}
