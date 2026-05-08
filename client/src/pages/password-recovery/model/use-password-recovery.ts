import type { INmorphFromDataExpose } from '@nmorph/nmorph-ui-kit'
import { useIntervalFn } from '@vueuse/core'
import {
  CODES_ENDPOINTS,
  NON_EMPTY_PATTERN,
  ROUTE_NAMES,
  type ICodeValidationPayload,
  createValidationMessages,
  type ISendPasswordRecoveryCodePayload,
  type ISendPasswordRecoveryCodeResponse,
  type IValidatePasswordRecoveryCodeResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { computed, onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useHttp, useProtectedActionCaptcha } from 'src/shared/api'
import { buildPathWithParams, getNextRequestIntervalSeconds, useI18n } from 'src/shared/lib'

import {
  DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA,
  DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA,
  EMAIL_PATTERN,
  PASSWORD_RECOVERY_COUNTER_TICK_MS
} from '../config/constants'

const getCounterValue = (nextRequestTimestampMs: number) =>
  Math.max(0, Math.round(getNextRequestIntervalSeconds(nextRequestTimestampMs)))

export const usePasswordRecovery = () => {
  const route = useRoute()
  const router = useRouter()
  const { doHttpRequest } = useHttp()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const { email } = clone(DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA)
  const { code } = clone(DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA)
  const emailFormRef = shallowRef<INmorphFromDataExpose | null>(null)
  const codeFormRef = shallowRef<INmorphFromDataExpose | null>(null)
  const emailFormData = reactive({
    email: {
      value: email,
      rules: [
        { pattern: NON_EMPTY_PATTERN, error: validationMessages.emailIsRequired },
        { pattern: EMAIL_PATTERN, error: validationMessages.invalidEmailFormat }
      ]
    }
  })
  const codeFormData = reactive({
    code: {
      value: code,
      rules: [{ pattern: NON_EMPTY_PATTERN, error: validationMessages.fieldIsRequired }]
    }
  })
  const emailSendCodeIsLoading = ref(false)
  const codeValidationIsLoading = ref(false)
  const codeSent = ref(false)
  const counterValue = ref(0)
  const debugCode = ref('')
  const sendCaptcha = useProtectedActionCaptcha()
  const validateCaptcha = useProtectedActionCaptcha()
  const isEmailFormValid = computed(() => emailFormRef.value?.formData.isFormValid.value ?? false)
  const isCodeFormValid = computed(() => codeFormRef.value?.formData.isFormValid.value ?? false)

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

  const sendEmailCode = async () => {
    if (!isEmailFormValid.value) return

    const email = emailFormData.email.value

    emailSendCodeIsLoading.value = true
    const requestPayload: ISendPasswordRecoveryCodePayload = {
      email,
      ...sendCaptcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doHttpRequest<ISendPasswordRecoveryCodeResponse>(
        'post',
        CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
        requestPayload
      )
      const { nextTimeRequest: nextRequestTimestampMs, debugCode: nextDebugCode } = response.data.payload

      codeSent.value = true
      emailFormData.email.value = requestPayload.email
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

  const validateCode = async () => {
    if (!isCodeFormValid.value) return

    const code = codeFormData.code.value

    codeValidationIsLoading.value = true
    const requestPayload: ICodeValidationPayload = {
      email: emailFormData.email.value,
      code,
      ...validateCaptcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doHttpRequest<IValidatePasswordRecoveryCodeResponse>(
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
      emailFormData.email.value = email
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
    codeFormRef,
    codeSent,
    codeValidationIsLoading,
    counterValue,
    debugCode,
    emailFormData,
    emailFormRef,
    emailSendCodeIsLoading,
    initializePasswordRecovery,
    isCodeFormValid,
    isEmailFormValid,
    sendCaptcha,
    sendEmailCode,
    validateCaptcha,
    validateCode
  }
}
