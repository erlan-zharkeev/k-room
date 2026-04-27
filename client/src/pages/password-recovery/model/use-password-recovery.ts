import type { FormProps, FormSubmitEvent } from '@primevue/forms/form'
import { valibotResolver } from '@primevue/forms/resolvers/valibot'
import {
  CODES_ENDPOINTS,
  ROUTE_NAMES,
  createPasswordRecoveryCodeFormSchema,
  createPasswordRecoveryEmailFormSchema,
  createValidationMessages,
  type ISendPasswordRecoveryCodeResponse,
  type IValidatePasswordRecoveryCodeResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useApi } from 'src/shared/api'
import { buildPathWithParams, getNextRequestIntervalSeconds, useI18n } from 'src/shared/lib'

import {
  DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA,
  DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA,
  PASSWORD_RECOVERY_COUNTER_TICK_MS
} from '../config/constants'

const getCounterValue = (nextRequestTimestampMs: number) =>
  Math.max(0, Math.round(getNextRequestIntervalSeconds(nextRequestTimestampMs)))

export const usePasswordRecovery = () => {
  const route = useRoute()
  const router = useRouter()
  const { doRequest } = useApi()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const emailFormData = reactive(clone(DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA))
  const codeFormData = reactive(clone(DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA))
  const emailResolver: FormProps['resolver'] = valibotResolver(
    createPasswordRecoveryEmailFormSchema(validationMessages)
  )
  const codeResolver: FormProps['resolver'] = valibotResolver(createPasswordRecoveryCodeFormSchema(validationMessages))
  const emailSendCodeIsLoading = ref(false)
  const codeValidationIsLoading = ref(false)
  const codeSent = ref(false)
  const counterValue = ref(0)
  const debugCode = ref('')
  let counterIntervalId: ReturnType<typeof setInterval> | undefined

  const stopCounter = () => {
    if (counterIntervalId) {
      clearInterval(counterIntervalId)
      counterIntervalId = undefined
    }
  }

  const startCounter = () => {
    stopCounter()
    counterIntervalId = setInterval(() => {
      counterValue.value = Math.max(counterValue.value - 1, 0)

      if (counterValue.value <= 0) {
        stopCounter()
      }
    }, PASSWORD_RECOVERY_COUNTER_TICK_MS)
  }

  const syncQuery = async (email: string, nextRequestTimestampMs: number) => {
    await router.replace({
      query: {
        ...route.query,
        'user-email': email,
        'next-time-request': String(nextRequestTimestampMs)
      }
    })
  }

  const sendEmailCode = async ({ valid }: FormSubmitEvent) => {
    if (!valid) return

    const { email } = emailFormData

    emailSendCodeIsLoading.value = true

    try {
      const normalizedEmail = email.trim()
      const response = await doRequest<ISendPasswordRecoveryCodeResponse>(
        'post',
        CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
        { email: normalizedEmail }
      )
      const { nextTimeRequest: nextRequestTimestampMs, debugCode: nextDebugCode } = response.data.payload

      codeSent.value = true
      emailFormData.email = normalizedEmail
      debugCode.value = nextDebugCode ?? ''
      counterValue.value = getCounterValue(nextRequestTimestampMs)
      await syncQuery(normalizedEmail, nextRequestTimestampMs)
      startCounter()
    } finally {
      emailSendCodeIsLoading.value = false
    }
  }

  const validateCode = async ({ valid }: FormSubmitEvent) => {
    if (!valid) return

    const { code } = codeFormData

    codeValidationIsLoading.value = true

    try {
      const response = await doRequest<IValidatePasswordRecoveryCodeResponse>(
        'post',
        CODES_ENDPOINTS.validateEmailCodePasswordRecovery,
        {
          email: emailFormData.email.trim(),
          code: code.trim()
        }
      )
      const { query } = response.data.payload

      await router.push(buildPathWithParams(ROUTE_NAMES.createNewPassword, { 'password-recovery': query }))
    } finally {
      codeValidationIsLoading.value = false
    }
  }

  const initializePasswordRecovery = () => {
    const email = route.query['user-email']
    const nextRequestTimestampMs = Number(route.query['next-time-request'])

    if (typeof email === 'string') {
      emailFormData.email = email
      codeSent.value = true
    }

    if (nextRequestTimestampMs) {
      counterValue.value = getCounterValue(nextRequestTimestampMs)
      startCounter()
    }
  }

  onBeforeUnmount(stopCounter)

  return {
    codeFormData,
    codeResolver,
    codeSent,
    codeValidationIsLoading,
    counterValue,
    debugCode,
    emailFormData,
    emailResolver,
    emailSendCodeIsLoading,
    initializePasswordRecovery,
    sendEmailCode,
    validateCode
  }
}
