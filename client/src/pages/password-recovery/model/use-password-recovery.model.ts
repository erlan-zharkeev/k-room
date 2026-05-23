import type { INmorphFromDataExpose } from '@nmorph/nmorph-ui-kit'
import {
  CODES_ENDPOINTS,
  NON_EMPTY_PATTERN,
  ROUTE_NAMES,
  type CodeValidationPayload,
  createValidationMessages,
  type SendPasswordRecoveryCodePayload,
  type SendPasswordRecoveryCodeResponse,
  type ValidatePasswordRecoveryCodeResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { computed, reactive, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useHttp, useProtectedActionCaptcha } from 'src/shared/api'
import { buildPathWithParams, useI18n, useRequestCooldownCounter } from 'src/shared/lib'

import {
  DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA,
  DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA,
  EMAIL_PATTERN,
  PASSWORD_RECOVERY_COUNTER_TICK_MS
} from '../config/constants'

export const usePasswordRecovery = () => {
  const route = useRoute()
  const router = useRouter()
  const { doHttpRequest } = useHttp()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const { email } = clone(DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA)
  const { code } = clone(DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA)
  const emailFormRef = useTemplateRef<INmorphFromDataExpose>('emailFormRef')
  const codeFormRef = useTemplateRef<INmorphFromDataExpose>('codeFormRef')
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
  const debugCode = ref('')
  const sendCaptcha = useProtectedActionCaptcha()
  const validateCaptcha = useProtectedActionCaptcha()
  const isEmailFormValid = computed(() => emailFormRef.value?.formData.isFormValid.value ?? false)
  const isCodeFormValid = computed(() => codeFormRef.value?.formData.isFormValid.value ?? false)
  const { counterValue, syncCounterValue } = useRequestCooldownCounter(PASSWORD_RECOVERY_COUNTER_TICK_MS)

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
    const requestPayload: SendPasswordRecoveryCodePayload = {
      email,
      ...sendCaptcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doHttpRequest<SendPasswordRecoveryCodeResponse>(
        'post',
        CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
        requestPayload
      )
      const { nextTimeRequest: nextRequestTimestampMs, debugCode: nextDebugCode } = response.data.payload

      codeSent.value = true
      emailFormData.email.value = requestPayload.email
      debugCode.value = nextDebugCode ?? ''
      await syncQuery(requestPayload.email, nextRequestTimestampMs)
      syncCounterValue(nextRequestTimestampMs)
    } catch (error) {
      const payload = sendCaptcha.handleProtectedActionError(error)

      if (payload?.nextTryAt) {
        await syncQuery(requestPayload.email, payload.nextTryAt)
        syncCounterValue(payload.nextTryAt)
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
    const requestPayload: CodeValidationPayload = {
      email: emailFormData.email.value,
      code,
      ...validateCaptcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doHttpRequest<ValidatePasswordRecoveryCodeResponse>(
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
      syncCounterValue(nextRequestTimestampMs)
    }
  }

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
