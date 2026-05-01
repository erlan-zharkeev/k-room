import { CODES_ENDPOINTS, EMAIL_CODE_LENGTH } from 'global-shared'
import { computed, ref } from 'vue'

import { useUser } from 'src/entities/user'
import { useApi } from 'src/shared/api'

export const useSettingsChangeEmailCard = () => {
  const { doRequest } = useApi()
  const { user, update } = useUser()
  const nextEmail = ref('')
  const otpCode = ref('')
  const isEmailCodeSending = ref(false)
  const isEmailCodeValidating = ref(false)
  const currentEmail = computed(() => user.value.email)
  const normalizedNextEmail = computed(() => nextEmail.value.trim())
  const emailNotChanged = computed(
    () =>
      Boolean(normalizedNextEmail.value) && normalizedNextEmail.value.toLowerCase() === currentEmail.value.toLowerCase()
  )
  const isSendCodeDisabled = computed(() => !user.value.id || !normalizedNextEmail.value || emailNotChanged.value)
  const isValidateCodeDisabled = computed(() => isSendCodeDisabled.value || otpCode.value.length !== EMAIL_CODE_LENGTH)

  const sendEmailCode = async () => {
    if (isSendCodeDisabled.value) return

    try {
      isEmailCodeSending.value = true
      await doRequest<null>('post', CODES_ENDPOINTS.sendEmailCodeChangeEmail, {
        email: normalizedNextEmail.value
      })
      otpCode.value = ''
    } finally {
      isEmailCodeSending.value = false
    }
  }

  const validateEmailCode = async () => {
    if (isValidateCodeDisabled.value) return

    try {
      isEmailCodeValidating.value = true
      await doRequest<null>('post', CODES_ENDPOINTS.validateEmailCodeChangeEmail, {
        email: normalizedNextEmail.value,
        code: otpCode.value
      })
      await update({ email: normalizedNextEmail.value })
      nextEmail.value = ''
      otpCode.value = ''
    } finally {
      isEmailCodeValidating.value = false
    }
  }

  return {
    currentEmail,
    emailNotChanged,
    isEmailCodeSending,
    isEmailCodeValidating,
    isSendCodeDisabled,
    isValidateCodeDisabled,
    nextEmail,
    otpCode,
    sendEmailCode,
    validateEmailCode
  }
}
