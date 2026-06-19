import type { INmorphFormDataExpose } from '@nmorph/nmorph-ui-kit'
import {
  AUTH_ENDPOINTS,
  NON_EMPTY_PATTERN,
  createValidationMessages,
  type AuthLoginPayload,
  type UserData
} from 'global-shared'
import { computed, reactive, ref, useTemplateRef } from 'vue'

import { useSystem } from 'src/entities/system'
import { useClientSession } from 'src/features/client-session'
import { useHttp, useProtectedActionCaptcha } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { DEFAULT_LOGIN_FORM_DATA } from '../config/constants'

import type { LoginFormData } from './types'
import { useFirebase } from './use-firebase.model'

export const useLogin = () => {
  const { doHttpRequest } = useHttp()
  const { activateClientSession } = useClientSession()
  const { hasInteracted } = useSystem()
  const { isFirebaseLoginLoading, onFirebaseLogin } = useFirebase()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const isLoading = ref(false)
  const formRef = useTemplateRef<INmorphFormDataExpose>('formRef')
  const formData = reactive<LoginFormData>({
    login: {
      value: DEFAULT_LOGIN_FORM_DATA.login,
      rules: [{ pattern: NON_EMPTY_PATTERN, error: validationMessages.fieldIsRequired }]
    },
    password: {
      value: DEFAULT_LOGIN_FORM_DATA.password,
      rules: [{ pattern: NON_EMPTY_PATTERN, error: validationMessages.passwordIsRequired }]
    }
  })
  const {
    captchaAvailable,
    captchaRequired,
    captchaResetKey,
    captchaToken,
    createProtectedActionPayload,
    handleProtectedActionError,
    resetCaptchaByPayload
  } = useProtectedActionCaptcha()

  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value)
  const isFormDisabled = computed(() => isLoading.value || isFirebaseLoginLoading.value)
  const isCaptchaBlocked = computed(() => captchaRequired.value && !captchaToken.value)
  const isSubmitDisabled = computed(() => isFormDisabled.value || isCaptchaBlocked.value)
  const isSubmitBtnDisabled = computed(() => {
    if (!hasInteracted.value) return false

    return isSubmitDisabled.value || !isFormValid.value
  })

  const login = async (payload: AuthLoginPayload) => {
    isLoading.value = true

    try {
      const response = await doHttpRequest<UserData>('post', AUTH_ENDPOINTS.login, payload)
      const { payload: user } = response.data

      await activateClientSession(user)
    } catch (error) {
      handleProtectedActionError(error)
    } finally {
      resetCaptchaByPayload(payload)
      isLoading.value = false
    }
  }

  const submit = () => {
    if (!isFormValid.value) return

    const { requestPayload } = createProtectedActionPayload({
      login: formData.login.value.trim(),
      password: formData.password.value
    })

    login(requestPayload)
  }

  return {
    captchaAvailable,
    captchaRequired,
    captchaResetKey,
    captchaToken,
    formData,
    isFirebaseLoginLoading,
    isFormDisabled,
    isLoading,
    isFormValid,
    isSubmitBtnDisabled,
    isSubmitDisabled,
    login,
    onFirebaseLogin,
    submit
  }
}
