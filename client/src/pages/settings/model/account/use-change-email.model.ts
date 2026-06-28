import type { INmorphFormDataExpose } from '@nmorph/nmorph-ui-kit'
import {
  CODES_ENDPOINTS,
  EMAIL_CODE_LENGTH,
  NON_EMPTY_PATTERN,
  type CodeRequestResponse,
  createValidationMessages,
  type ValidateChangeEmailCodeResponse
} from 'global-shared'
import { computed, reactive, ref, useTemplateRef, watch } from 'vue'

import { useUser } from 'src/entities/user'
import { isExpectedHttpError, useHttp } from 'src/shared/api'
import { createDifferentOrEmptyValidationPattern, useI18n } from 'src/shared/lib'

import { SETTINGS_EMAIL_PATTERN } from '../../config/constants/account.constants'
import { SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N } from '../../config/i18n/account-change-email.i18n'

export const useChangeEmail = () => {
  const { doHttpRequest } = useHttp()
  const { user, update } = useUser()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const formRef = useTemplateRef<INmorphFormDataExpose>('formRef')
  const formResetKey = ref(0)
  const formData = reactive({
    currentEmail: { value: '', rules: [] },
    nextEmail: {
      value: '',
      rules: [
        { pattern: NON_EMPTY_PATTERN, error: validationMessages.emailIsRequired },
        { pattern: SETTINGS_EMAIL_PATTERN, error: validationMessages.invalidEmailFormat }
      ]
    }
  })
  const otpCode = ref('')
  const codeSentEmail = ref('')
  const isEmailCodeSending = ref(false)
  const isEmailCodeValidating = ref(false)
  const currentEmail = computed(() => user.value.email)
  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value ?? false)
  const normalizedNextEmail = computed(() => formData.nextEmail.value.trim())
  const isSendCodeDisabled = computed(() => !user.value.id || !isFormValid.value)
  const isEmailCodeVisible = computed(
    () => Boolean(codeSentEmail.value) && codeSentEmail.value === normalizedNextEmail.value && !isSendCodeDisabled.value
  )
  const isValidateCodeDisabled = computed(() => !isEmailCodeVisible.value || otpCode.value.length !== EMAIL_CODE_LENGTH)

  const sendEmailCode = async () => {
    if (isSendCodeDisabled.value) return

    try {
      isEmailCodeSending.value = true
      await doHttpRequest<CodeRequestResponse>('post', CODES_ENDPOINTS.sendEmailCodeChangeEmail, {
        email: normalizedNextEmail.value
      })
      codeSentEmail.value = normalizedNextEmail.value
      otpCode.value = ''
    } catch (error) {
      if (isExpectedHttpError(error)) return

      throw error
    } finally {
      isEmailCodeSending.value = false
    }
  }

  const validateEmailCode = async () => {
    if (isValidateCodeDisabled.value) return

    try {
      isEmailCodeValidating.value = true
      await doHttpRequest<ValidateChangeEmailCodeResponse>('post', CODES_ENDPOINTS.validateEmailCodeChangeEmail, {
        email: normalizedNextEmail.value,
        code: otpCode.value
      })
      await update({ email: normalizedNextEmail.value })
      formData.nextEmail.value = ''
      otpCode.value = ''
      codeSentEmail.value = ''
      formResetKey.value += 1
    } catch (error) {
      if (isExpectedHttpError(error)) return

      throw error
    } finally {
      isEmailCodeValidating.value = false
    }
  }

  watch(
    currentEmail,
    (email) => {
      formData.currentEmail.value = email
      formData.nextEmail.rules = [
        { pattern: NON_EMPTY_PATTERN, error: validationMessages.emailIsRequired },
        { pattern: SETTINGS_EMAIL_PATTERN, error: validationMessages.invalidEmailFormat },
        {
          pattern: createDifferentOrEmptyValidationPattern(email, 'i'),
          error: t(SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N.emailNotChanged)
        }
      ]
    },
    { immediate: true }
  )

  return {
    currentEmail,
    formData,
    formResetKey,
    isEmailCodeVisible,
    isEmailCodeSending,
    isEmailCodeValidating,
    isSendCodeDisabled,
    isValidateCodeDisabled,
    otpCode,
    sendEmailCode,
    validateEmailCode
  }
}
