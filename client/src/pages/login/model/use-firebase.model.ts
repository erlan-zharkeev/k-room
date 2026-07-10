import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import {
  AUTH_ENDPOINTS,
  isString,
  isUnknownObject,
  type FirebaseProvider,
  type SignInWithProviderPayload,
  type UserData
} from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useClientSession } from 'src/features/client-session'
import { isExpectedHttpError, useHttp } from 'src/shared/api'
import {
  captureClientSentryMessage,
  log,
  TOAST_I18N,
  useAppToast,
  useI18n,
  withClientSentryScope
} from 'src/shared/lib'

import { E2E_FIREBASE_AUTH_RESULT } from '../config/constants'
import { LOGIN_FORM_I18N } from '../config/i18n'

import { initFirebase } from './init-firebase.model'

const firebaseAuth = __CLIENT_ENV_DATA__.isE2E ? null : getAuth(initFirebase())

const getFirebaseAuth = () => {
  if (!firebaseAuth) {
    throw new Error('Firebase auth is not initialized')
  }

  return firebaseAuth
}

const readFirebaseErrorField = (error: unknown, field: string) => {
  if (!isUnknownObject(error)) return undefined

  const value = Reflect.get(error, field)

  return isString(value) ? value : undefined
}

const readFirebaseLoginRuntimeDiagnostics = () => {
  const userActivation = typeof navigator === 'undefined' ? undefined : Reflect.get(navigator, 'userActivation')
  const isUserActivationAvailable = isUnknownObject(userActivation)

  return {
    documentHasFocus: typeof document === 'undefined' ? undefined : document.hasFocus(),
    documentVisibilityState: typeof document === 'undefined' ? undefined : document.visibilityState,
    isSecureContext: typeof window === 'undefined' ? undefined : window.isSecureContext,
    isTopWindow: typeof window === 'undefined' ? undefined : window.top === window,
    userActivationHasBeenActive: isUserActivationAvailable
      ? Boolean(Reflect.get(userActivation, 'hasBeenActive'))
      : undefined,
    userActivationIsActive: isUserActivationAvailable ? Boolean(Reflect.get(userActivation, 'isActive')) : undefined
  }
}

const captureFirebaseLoginFailure = (error: unknown, provider: FirebaseProvider) => {
  const code = readFirebaseErrorField(error, 'code')
  const name = readFirebaseErrorField(error, 'name')

  withClientSentryScope((scope) => {
    scope.setLevel('warning')
    scope.setTag('firebase_login.code', code ?? 'unknown')
    scope.setTag('firebase_login.diagnostic', 'true')
    scope.setTag('firebase_login.name', name ?? 'unknown')
    scope.setTag('firebase_login.provider', provider)
    scope.setContext('firebase_login', {
      code: code ?? null,
      message: readFirebaseErrorField(error, 'message') ?? null,
      name: name ?? null,
      online: typeof navigator === 'undefined' ? undefined : navigator.onLine,
      provider,
      ...readFirebaseLoginRuntimeDiagnostics(),
      userAgent: typeof navigator === 'undefined' ? undefined : navigator.userAgent
    })

    captureClientSentryMessage('Firebase login failed')
  })
}

export const useFirebase = () => {
  const { doHttpRequest } = useHttp()
  const { activateClientSession } = useClientSession()
  const { settings } = useSettings()
  const { t } = useI18n()
  const toast = useAppToast()
  const isFirebaseLoginLoading = ref(false)
  const isFirebaseLoginReady = ref(true)

  const getFirebaseCredential = async (provider: FirebaseProvider) => {
    if (__CLIENT_ENV_DATA__.isE2E) {
      return E2E_FIREBASE_AUTH_RESULT
    }

    const Provider = provider === 'google' ? GoogleAuthProvider : FacebookAuthProvider
    const currentProvider = new Provider()
    const auth = getFirebaseAuth()

    auth.languageCode = settings.value.localization.language

    const signInResult = signInWithPopup(auth, currentProvider)
    const result = await signInResult
    const { displayName, email, photoURL, uid } = result.user

    return {
      displayName,
      email,
      photoURL,
      uid,
      provider
    }
  }

  const buildCredential = async (provider: FirebaseProvider): Promise<SignInWithProviderPayload | null> => {
    try {
      const { displayName, email, photoURL, uid, provider: normalizedProvider } = await getFirebaseCredential(provider)
      const haveFullData = displayName && email && uid && normalizedProvider

      if (!haveFullData) return null

      return {
        nickname: uuidv4().replace(/-/g, ''),
        email,
        avatar: photoURL ?? undefined,
        provider: normalizedProvider
      }
    } catch (error) {
      captureFirebaseLoginFailure(error, provider)
      log('error', 'Firebase login failed', error)

      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: t(LOGIN_FORM_I18N.failedToLogin)
      })

      return null
    }
  }

  const signInWithCredential = async (credential: SignInWithProviderPayload) => {
    const response = await doHttpRequest<UserData>('post', AUTH_ENDPOINTS.providerLogin, credential)
    const { payload } = response.data

    await activateClientSession(payload)
  }

  const onFirebaseLogin = async (provider: FirebaseProvider) => {
    isFirebaseLoginLoading.value = true

    try {
      const credential = await buildCredential(provider)

      if (!credential) return

      await signInWithCredential(credential)
    } catch (error) {
      if (isExpectedHttpError(error)) return

      throw error
    } finally {
      isFirebaseLoginLoading.value = false
    }
  }

  return {
    isFirebaseLoginReady,
    isFirebaseLoginLoading,
    onFirebaseLogin
  }
}
