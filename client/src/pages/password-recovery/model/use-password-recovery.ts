import type { FormProps, FormSubmitEvent } from '@primevue/forms/form'
import { valibotResolver } from '@primevue/forms/resolvers/valibot'
import { useIntervalFn } from '@vueuse/core'
import {
  CODES_ENDPOINTS,
  ROUTE_NAMES,
  type ICodeValidationPayload,
  createPasswordRecoveryCodeFormSchema,
  createPasswordRecoveryEmailFormSchema,
  createValidationMessages,
  type ISendPasswordRecoveryCodePayload,
  type ISendPasswordRecoveryCodeResponse,
  type IValidatePasswordRecoveryCodeResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useApi, useProtectedActionCaptcha } from 'src/shared/api'
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
  const sendCaptcha = useProtectedActionCaptcha()
  const validateCaptcha = useProtectedActionCaptcha()

  const { pause: pauseCounter, resume: resumeCounter } = useIntervalFn(
    () => {
      counterValue.value = Math.max(counterValue.value - 1, 0)

      if (counterValue.value <= 0) {
        pauseCounter()
      }
    },
    PASSWORD_RECOVERY_COUNTER_TICK_MS,
    { immediate: false, immediateCallback: false }
  )

  const stopCounter = () => pauseCounter()

  const startCounter = () => {
    stopCounter()
    resumeCounter()
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
    const requestPayload: ISendPasswordRecoveryCodePayload = {
      email,
      ...sendCaptcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doRequest<ISendPasswordRecoveryCodeResponse>(
        'post',
        CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
        requestPayload
      )
      const { nextTimeRequest: nextRequestTimestampMs, debugCode: nextDebugCode } = response.data.payload

      codeSent.value = true
      emailFormData.email = requestPayload.email
      debugCode.value = nextDebugCode ?? ''
      counterValue.value = getCounterValue(nextRequestTimestampMs)
      await syncQuery(requestPayload.email, nextRequestTimestampMs)
      startCounter()
    } catch (error) {
      const payload = sendCaptcha.handleProtectedActionError(error)

      if (payload?.nextTryAt) {
        counterValue.value = getCounterValue(payload.nextTryAt)
        await syncQuery(requestPayload.email, payload.nextTryAt)
        startCounter()
      }
    } finally {
      if (shouldResetCaptcha) {
        sendCaptcha.resetCaptcha()
      }

      emailSendCodeIsLoading.value = false
    }
  }

  const validateCode = async ({ valid }: FormSubmitEvent) => {
    if (!valid) return

    const { code } = codeFormData

    codeValidationIsLoading.value = true
    const requestPayload: ICodeValidationPayload = {
      email: emailFormData.email,
      code,
      ...validateCaptcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doRequest<IValidatePasswordRecoveryCodeResponse>(
        'post',
        CODES_ENDPOINTS.validateEmailCodePasswordRecovery,
        requestPayload
      )
      const { query } = response.data.payload

      await router.push(buildPathWithParams(ROUTE_NAMES.createNewPassword, { 'password-recovery': query }))
    } catch (error) {
      validateCaptcha.handleProtectedActionError(error)
    } finally {
      if (shouldResetCaptcha) {
        validateCaptcha.resetCaptcha()
      }

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
    sendCaptcha,
    sendEmailCode,
    validateCaptcha,
    validateCode
  }
}
