import {
  CODES_ENDPOINTS,
  ROUTE_NAMES,
  type ISendPasswordRecoveryCodeResponse,
  type IValidatePasswordRecoveryCodeResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useApi } from 'src/shared/api'
import {
  buildPathWithParams,
  getNextReqInterval,
  log,
  useFormValidation,
  usePrimeVueFormResolver
} from 'src/shared/lib'

import {
  DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA,
  DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA,
  PASSWORD_RECOVERY_COUNTER_TICK_MS
} from '../config/constants'
import { PASSWORD_RECOVERY_CODE_RULES, PASSWORD_RECOVERY_EMAIL_RULES } from '../config/rules'

const getCounterValue = (nextRequestTime: number) => Math.max(0, Math.round(getNextReqInterval(nextRequestTime)))

export const usePasswordRecovery = () => {
  const route = useRoute()
  const router = useRouter()
  const { doRequest } = useApi()
  const emailFormData = reactive(clone(DEFAULT_PASSWORD_RECOVERY_EMAIL_FORM_DATA))
  const codeFormData = reactive(clone(DEFAULT_PASSWORD_RECOVERY_CODE_FORM_DATA))
  const emailValidation = useFormValidation(emailFormData, PASSWORD_RECOVERY_EMAIL_RULES)
  const codeValidation = useFormValidation(codeFormData, PASSWORD_RECOVERY_CODE_RULES)
  const emailResolver = usePrimeVueFormResolver(PASSWORD_RECOVERY_EMAIL_RULES)
  const codeResolver = usePrimeVueFormResolver(PASSWORD_RECOVERY_CODE_RULES)
  const emailSendCodeIsLoading = ref(false)
  const codeValidationIsLoading = ref(false)
  const codeSent = ref(false)
  const counterValue = ref(0)
  const debugCode = ref('')
  let counterInterval: ReturnType<typeof setInterval> | undefined

  const hasPresetEmail = computed(() => Boolean(route.query['user-email']))
  const isSendCodeDisabled = computed(
    () => emailSendCodeIsLoading.value || counterValue.value > 0 || !emailValidation.isFormValid.value
  )
  const isValidateCodeDisabled = computed(() => codeValidationIsLoading.value || !codeValidation.isFormValid.value)
  const isEmailInputDisabled = computed(() => emailSendCodeIsLoading.value || hasPresetEmail.value)
  const isEmailInvalid = computed(() => Boolean(emailValidation.visibleErrors.value.email?.length))
  const isCodeInvalid = computed(() => Boolean(codeValidation.visibleErrors.value.code?.length))
  const emailErrorText = computed(() => emailValidation.getFirstErrorText('email'))
  const codeErrorText = computed(() => codeValidation.getFirstErrorText('code'))

  const stopCounter = () => {
    if (counterInterval) {
      clearInterval(counterInterval)
      counterInterval = undefined
    }
  }

  const startCounter = () => {
    stopCounter()
    counterInterval = setInterval(() => {
      counterValue.value = Math.max(counterValue.value - 1, 0)

      if (counterValue.value <= 0) {
        stopCounter()
      }
    }, PASSWORD_RECOVERY_COUNTER_TICK_MS)
  }

  const syncQuery = async (email: string, nextTimeRequest: number) => {
    await router.replace({
      query: {
        ...route.query,
        'user-email': email,
        'next-time-request': String(nextTimeRequest)
      }
    })
  }

  const sendEmailCode = async () => {
    emailValidation.submitForm(async () => {
      emailSendCodeIsLoading.value = true

      try {
        const email = emailFormData.email.trim()
        const response = await doRequest<ISendPasswordRecoveryCodeResponse>(
          'post',
          CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
          { email }
        )
        const { nextTimeRequest, debugCode: nextDebugCode } = response.data.payload

        codeSent.value = true
        debugCode.value = nextDebugCode ?? ''
        counterValue.value = getCounterValue(nextTimeRequest)
        await syncQuery(email, nextTimeRequest)
        startCounter()
      } catch (error) {
        log('error', 'Password recovery code send failed', error)
      } finally {
        emailSendCodeIsLoading.value = false
      }
    })
  }

  const validateCode = async () => {
    codeValidation.submitForm(async () => {
      codeValidationIsLoading.value = true

      try {
        const response = await doRequest<IValidatePasswordRecoveryCodeResponse>(
          'post',
          CODES_ENDPOINTS.validateEmailCodePasswordRecovery,
          {
            email: emailFormData.email.trim(),
            code: codeFormData.code.trim()
          }
        )
        const { query } = response.data.payload

        await router.push(buildPathWithParams(ROUTE_NAMES.createNewPassword, { 'password-recovery': query }))
      } catch (error) {
        log('error', 'Password recovery code validation failed', error)
      } finally {
        codeValidationIsLoading.value = false
      }
    })
  }

  const initializePasswordRecovery = () => {
    const email = route.query['user-email']
    const nextTimeRequest = Number(route.query['next-time-request'])

    if (typeof email === 'string') {
      emailFormData.email = email
      codeSent.value = true
    }

    if (nextTimeRequest) {
      counterValue.value = getCounterValue(nextTimeRequest)
      startCounter()
    }
  }

  onBeforeUnmount(stopCounter)

  return {
    codeErrorText,
    codeFormData,
    codeResolver,
    codeSent,
    codeValidation,
    codeValidationIsLoading,
    counterValue,
    debugCode,
    emailErrorText,
    emailFormData,
    emailResolver,
    emailSendCodeIsLoading,
    emailValidation,
    hasPresetEmail,
    isCodeInvalid,
    isEmailInputDisabled,
    isEmailInvalid,
    isSendCodeDisabled,
    isValidateCodeDisabled,
    initializePasswordRecovery,
    sendEmailCode,
    validateCode
  }
}
