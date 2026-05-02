import type { INmorphFromDataExpose } from '@nmorph/nmorph-ui-kit'
import { AUTH_ENDPOINTS, type IAuthLoginPayload, type ILoginResponse } from 'global-shared'
import { createValidationMessages } from 'global-shared'
import { computed, reactive, shallowRef, ref } from 'vue'

import { useUserSession } from 'src/entities/user'
import { useApi, useProtectedActionCaptcha } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { DEFAULT_LOGIN_FORM_DATA } from '../config/constants'

import type { ILoginFormData } from './types'

const NON_EMPTY_PATTERN = /^(?!\s*$).+/

export const useLogin = () => {
  const { doRequest } = useApi()
  const { activateUserSession } = useUserSession()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const isLoading = ref(false)
  const formRef = shallowRef<INmorphFromDataExpose | null>(null)
  const formData = reactive<ILoginFormData>({
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
  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value ?? false)

  const login = async (payload: IAuthLoginPayload) => {
    isLoading.value = true
    const shouldResetCaptcha = Boolean(payload.captchaToken)

    try {
      const response = await doRequest<ILoginResponse>('post', AUTH_ENDPOINTS.login, payload)
      const { payload: user } = response.data

      await activateUserSession(user)
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
    formRef,
    isLoading,
    isFormValid,
    login,
    submit
  }
}
