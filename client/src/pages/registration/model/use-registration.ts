import type { INmorphFromDataExpose, NmorphFormValueType } from '@nmorph/nmorph-ui-kit'
import {
  AUTH_ENDPOINTS,
  ROUTE_NAMES,
  createValidationMessages,
  normalizeNickname,
  type IAuthRegistrationPayload,
  type ISendConfirmationLinkResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { computed, reactive, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useApi, useProtectedActionCaptcha } from 'src/shared/api'
import { buildPathWithParams, useI18n } from 'src/shared/lib'

import {
  DEFAULT_REGISTRATION_FORM_DATA,
  EMAIL_PATTERN,
  NICKNAME_MAX_LENGTH_PATTERN,
  NICKNAME_MIN_LENGTH_PATTERN,
  NICKNAME_PATTERN,
  NON_EMPTY_PATTERN,
  PASSWORD_MIN_LENGTH_PATTERN,
  PASSWORD_NO_SPACES_PATTERN,
  PASSWORD_ONLY_LATIN_PATTERN,
  PASSWORD_STRONG_PATTERN
} from '../config/constants'

import type { IRegistrationFormData } from './types'

export const useRegistration = () => {
  const router = useRouter()
  const { doRequest } = useApi()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const isLoading = ref(false)
  const formRef = shallowRef<INmorphFromDataExpose | null>(null)
  const { email, nickname, password, policy } = clone(DEFAULT_REGISTRATION_FORM_DATA)
  const formData = reactive<IRegistrationFormData>({
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
      rules: [
        { pattern: NON_EMPTY_PATTERN, error: validationMessages.passwordIsRequired },
        { pattern: PASSWORD_MIN_LENGTH_PATTERN, error: validationMessages.passwordMustBeAtLeast },
        { pattern: PASSWORD_STRONG_PATTERN, error: validationMessages.passwordMustBeStrong },
        { pattern: PASSWORD_NO_SPACES_PATTERN, error: validationMessages.passwordNotContainSpaces },
        { pattern: PASSWORD_ONLY_LATIN_PATTERN, error: validationMessages.passwordMustContainOnlyLatin }
      ]
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
  const formValue = formData as unknown as NmorphFormValueType

  watch(
    () => formData.nickname.value,
    (value) => {
      const normalizedValue = normalizeNickname(value)

      if (normalizedValue === value) return

      formData.nickname.value = normalizedValue
    }
  )

  const {
    buildCaptchaPayload,
    captchaRequired,
    captchaResetKey,
    captchaToken,
    handleProtectedActionError,
    resetCaptcha
  } = useProtectedActionCaptcha()
  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value ?? false)

  const register = async (payload: IAuthRegistrationPayload) => {
    isLoading.value = true
    const shouldResetCaptcha = Boolean(payload.captchaToken)

    try {
      const response = await doRequest<ISendConfirmationLinkResponse>('post', AUTH_ENDPOINTS.registration, payload)
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
      nickname: normalizeNickname(formData.nickname.value),
      password: formData.password.value,
      ...buildCaptchaPayload()
    })
  }

  return {
    captchaRequired,
    captchaResetKey,
    captchaToken,
    formData,
    formValue,
    formRef,
    isFormValid,
    isLoading,
    register,
    submit
  }
}
