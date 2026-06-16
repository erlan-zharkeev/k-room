import type { INmorphFormDataExpose } from '@nmorph/nmorph-ui-kit'
import {
  CODES_ENDPOINTS,
  NON_EMPTY_PATTERN,
  ROUTE_NAMES,
  type CodeRequestResponse,
  createValidationMessages,
  type EmailCodeRequestPayload,
  type EmailCodeValidationPayload,
  isString,
  type ValidatePasswordRecoveryCodeResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { computed, onMounted, reactive, ref, useTemplateRef } from 'vue'
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
  const emailFormRef = useTemplateRef<INmorphFormDataExpose>('emailFormRef')
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
  const isSendingEmailCode = ref(false)
  const isValidatingCode = ref(false)
  const codeSent = ref(false)
  const debugCode = ref('')
  const sendCaptcha = useProtectedActionCaptcha()
  const validateCaptcha = useProtectedActionCaptcha()
  const {
    captchaRequired: sendCaptchaRequired,
    captchaToken: sendCaptchaToken,
    captchaResetKey: sendCaptchaResetKey
  } = sendCaptcha
  const {
    captchaRequired: validateCaptchaRequired,
    captchaToken: validateCaptchaToken,
    captchaResetKey: validateCaptchaResetKey
  } = validateCaptcha
  const { counterValue, syncCounterValue } = useRequestCooldownCounter(PASSWORD_RECOVERY_COUNTER_TICK_MS)
  const hasPresetEmail = computed(() => Boolean(route.query['user-email']))
  const isEmailFormValid = computed(() => emailFormRef.value?.formData.isFormValid.value ?? false)
  const isCodeFormValid = computed(() => NON_EMPTY_PATTERN.test(codeFormData.code.value))
  const isEmailInputDisabled = computed(() => isSendingEmailCode.value || hasPresetEmail.value)
  const isSendCodeCaptchaBlocked = computed(() => sendCaptchaRequired.value && !sendCaptchaToken.value)
  const isValidateCodeCaptchaBlocked = computed(() => validateCaptchaRequired.value && !validateCaptchaToken.value)
  const isSendCodeBlocked = computed(
    () => isSendingEmailCode.value || counterValue.value > 0 || isSendCodeCaptchaBlocked.value
  )
  const isValidateCodeBlocked = computed(() => isValidatingCode.value || isValidateCodeCaptchaBlocked.value)

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

    const email = emailFormData.email.value.trim()

    isSendingEmailCode.value = true
    const requestPayload: EmailCodeRequestPayload = {
      email,
      ...sendCaptcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doHttpRequest<CodeRequestResponse>(
        'post',
        CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
        requestPayload
      )
      const { nextRequestTime: nextRequestTimestampMs, debugCode: nextDebugCode } = response.data.payload

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

      isSendingEmailCode.value = false
    }
  }

  const validateCode = async () => {
    if (!isCodeFormValid.value) return

    const code = codeFormData.code.value.trim()

    isValidatingCode.value = true
    const requestPayload: EmailCodeValidationPayload = {
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

      isValidatingCode.value = false
    }
  }

  const initializePasswordRecovery = () => {
    const email = route.query['user-email']
    const nextRequestTimestampMs = Number(route.query['next-time-request'])

    if (isString(email)) {
      emailFormData.email.value = email
      codeSent.value = true
    }

    if (nextRequestTimestampMs) {
      syncCounterValue(nextRequestTimestampMs)
    }
  }

  onMounted(initializePasswordRecovery)

  return {
    codeFormData,
    codeSent,
    counterValue,
    debugCode,
    emailFormData,
    isCodeFormValid,
    isEmailInputDisabled,
    isEmailFormValid,
    isSendCodeBlocked,
    isSendingEmailCode,
    isValidateCodeBlocked,
    isValidatingCode,
    sendCaptchaRequired,
    sendCaptchaResetKey,
    sendCaptchaToken,
    sendEmailCode,
    validateCaptchaRequired,
    validateCaptchaResetKey,
    validateCaptchaToken,
    validateCode
  }
}
