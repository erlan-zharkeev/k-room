import type { INmorphFromDataExpose as NmorphFromDataExpose } from '@nmorph/nmorph-ui-kit'
import { CODES_ENDPOINTS, EMAIL_CODE_LENGTH, NON_EMPTY_PATTERN, createValidationMessages } from 'global-shared'
import { computed, reactive, ref, useTemplateRef, watch } from 'vue'

import { useUser } from 'src/entities/user'
import { useHttp } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { SETTINGS_EMAIL_PATTERN } from '../../config/constants/account.constants'

export const useChangeEmail = () => {
  const { doHttpRequest } = useHttp()
  const { user, update } = useUser()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const formRef = useTemplateRef<NmorphFromDataExpose>('formRef')
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
  const emailNotChanged = computed(
    () =>
      Boolean(normalizedNextEmail.value) && normalizedNextEmail.value.toLowerCase() === currentEmail.value.toLowerCase()
  )
  const isSendCodeDisabled = computed(() => !user.value.id || !isFormValid.value || emailNotChanged.value)
  const isEmailCodeVisible = computed(
    () => Boolean(codeSentEmail.value) && codeSentEmail.value === normalizedNextEmail.value && !isSendCodeDisabled.value
  )
  const isValidateCodeDisabled = computed(() => !isEmailCodeVisible.value || otpCode.value.length !== EMAIL_CODE_LENGTH)

  const sendEmailCode = async () => {
    if (isSendCodeDisabled.value) return

    try {
      isEmailCodeSending.value = true
      await doHttpRequest<null>('post', CODES_ENDPOINTS.sendEmailCodeChangeEmail, {
        email: normalizedNextEmail.value
      })
      codeSentEmail.value = normalizedNextEmail.value
      otpCode.value = ''
    } finally {
      isEmailCodeSending.value = false
    }
  }

  const validateEmailCode = async () => {
    if (isValidateCodeDisabled.value) return

    try {
      isEmailCodeValidating.value = true
      await doHttpRequest<null>('post', CODES_ENDPOINTS.validateEmailCodeChangeEmail, {
        email: normalizedNextEmail.value,
        code: otpCode.value
      })
      await update({ email: normalizedNextEmail.value })
      formData.nextEmail.value = ''
      otpCode.value = ''
      codeSentEmail.value = ''
    } finally {
      isEmailCodeValidating.value = false
    }
  }

  watch(
    currentEmail,
    (email) => {
      formData.currentEmail.value = email
    },
    { immediate: true }
  )

  return {
    currentEmail,
    emailNotChanged,
    formData,
    formRef,
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
