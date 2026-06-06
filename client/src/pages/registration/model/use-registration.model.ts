import type { INmorphFormDataExpose } from '@nmorph/nmorph-ui-kit'
import {
  AUTH_ENDPOINTS,
  EMAIL_PATTERN,
  NICKNAME_MAX_LENGTH_PATTERN,
  NICKNAME_MIN_LENGTH_PATTERN,
  NICKNAME_PATTERN,
  NON_EMPTY_PATTERN,
  ROUTE_NAMES,
  createValidationMessages,
  type AuthRegistrationPayload,
  type SendConfirmationLinkResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { computed, reactive, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

import { useHttp, useProtectedActionCaptcha } from 'src/shared/api'
import { buildPathWithParams, createPasswordValidationRules, useI18n } from 'src/shared/lib'

import { DEFAULT_REGISTRATION_FORM_DATA } from '../config/constants'

import type { RegistrationFormData } from './types'

export const useRegistration = () => {
  const router = useRouter()
  const { doHttpRequest } = useHttp()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const isLoading = ref(false)
  const formRef = useTemplateRef<INmorphFormDataExpose>('formRef')
  const { email, nickname, password, policy } = clone(DEFAULT_REGISTRATION_FORM_DATA)
  const formData = reactive<RegistrationFormData>({
    nickname: {
      value: nickname,
      rules: [
        { pattern: NON_EMPTY_PATTERN, error: validationMessages.fieldIsRequired },
        { pattern: NICKNAME_PATTERN, error: validationMessages.nicknameInvalidFormat },
        { pattern: NICKNAME_MIN_LENGTH_PATTERN, error: validationMessages.nicknameTooShort },
        { pattern: NICKNAME_MAX_LENGTH_PATTERN, error: validationMessages.nicknameTooLong }
      ]
    },
    email: {
      value: email,
      rules: [
        { pattern: NON_EMPTY_PATTERN, error: validationMessages.emailIsRequired },
        { pattern: EMAIL_PATTERN, error: validationMessages.invalidEmailFormat }
      ]
    },
    password: {
      value: password,
      rules: createPasswordValidationRules(validationMessages)
    },
    policy: {
      value: policy,
      rules: [
        {
          booleanCompareType: 'not-eq',
          compareValue: true,
          error: validationMessages.fieldIsRequired
        }
      ]
    }
  })
  const {
    buildCaptchaPayload,
    captchaRequired,
    captchaResetKey,
    captchaToken,
    handleProtectedActionError,
    resetCaptcha
  } = useProtectedActionCaptcha()
  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value ?? false)

  const register = async (payload: AuthRegistrationPayload) => {
    isLoading.value = true
    const shouldResetCaptcha = Boolean(payload.captchaToken)

    try {
      const response = await doHttpRequest<SendConfirmationLinkResponse>('post', AUTH_ENDPOINTS.registration, payload)
      const pathname = buildPathWithParams(ROUTE_NAMES.waitEmailConfirm, response.data.payload)

      await router.push(pathname)
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

    register({
      email: formData.email.value.trim(),
      nickname: formData.nickname.value,
      password: formData.password.value,
      ...buildCaptchaPayload()
    })
  }

  return {
    captchaRequired,
    captchaResetKey,
    captchaToken,
    formData,
    isFormValid,
    isLoading,
    register,
    submit
  }
}
