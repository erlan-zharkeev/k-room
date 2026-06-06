import type { INmorphFormDataExpose } from '@nmorph/nmorph-ui-kit'
import {
  AUTH_ENDPOINTS,
  NON_EMPTY_PATTERN,
  createValidationMessages,
  type AuthLoginPayload,
  type UserData
} from 'global-shared'
import { computed, reactive, ref, useTemplateRef } from 'vue'

import { useClientSession } from 'src/features/client-session'
import { useHttp, useProtectedActionCaptcha } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { DEFAULT_LOGIN_FORM_DATA } from '../config/constants'

import type { LoginFormData } from './types'

export const useLogin = () => {
  const { doHttpRequest } = useHttp()
  const { activateClientSession } = useClientSession()
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
    buildCaptchaPayload,
    captchaAvailable,
    captchaRequired,
    captchaResetKey,
    captchaToken,
    handleProtectedActionError,
    resetCaptcha
  } = useProtectedActionCaptcha()

  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value)

  const login = async (payload: AuthLoginPayload) => {
    isLoading.value = true
    const shouldResetCaptcha = Boolean(payload.captchaToken)

    try {
      const response = await doHttpRequest<UserData>('post', AUTH_ENDPOINTS.login, payload)
      const { payload: user } = response.data

      await activateClientSession(user)
    } catch (error) {
      handleProtectedActionError(error)
    } finally {
      if (shouldResetCaptcha) {
        resetCaptcha()
      }

      isLoading.value = false
    }
  }

  const submit = () => {
    if (!isFormValid.value) return

    login({
      login: formData.login.value.trim(),
      password: formData.password.value,
      ...buildCaptchaPayload()
    })
  }

  return {
    captchaAvailable,
    captchaRequired,
    captchaResetKey,
    captchaToken,
    formData,
    isLoading,
    isFormValid,
    login,
    submit
  }
}
