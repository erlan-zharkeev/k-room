import {
  AUTH_ENDPOINTS,
  ROUTE_NAMES,
  type SendConfirmationLinkPayload,
  type SendConfirmationLinkResponse
} from 'global-shared'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useHttp, useProtectedActionCaptcha } from 'src/shared/api'
import { buildPathWithParams, useRequestCooldownCounter } from 'src/shared/lib'

import { WAIT_EMAIL_CONFIRM_COUNTER_TICK_MS } from '../config/constants'

export const useWaitEmailConfirm = () => {
  const route = useRoute()
  const router = useRouter()
  const { doHttpRequest } = useHttp()
  const email = ref('')
  const attempts = ref(0)
  const isLoading = ref(false)
  const captcha = useProtectedActionCaptcha()
  const { counterValue, syncCounterValue } = useRequestCooldownCounter(WAIT_EMAIL_CONFIRM_COUNTER_TICK_MS)

  const syncQuery = async (payload: SendConfirmationLinkResponse) => {
    await router.replace(buildPathWithParams(ROUTE_NAMES.waitEmailConfirm, payload))
  }

  const resend = async () => {
    if (!email.value) return

    isLoading.value = true
    const requestPayload: SendConfirmationLinkPayload = {
      email: email.value,
      ...captcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doHttpRequest<SendConfirmationLinkResponse>(
        'post',
        AUTH_ENDPOINTS.sendEmailConfirmationLink,
        requestPayload
      )
      const payload = response.data.payload

      attempts.value = payload.attempts
      await syncQuery(payload)
      syncCounterValue(payload.nextRequestTime)
    } catch (error) {
      const payload = captcha.handleProtectedActionError(error)

      if (payload?.nextTryAt) {
        syncCounterValue(payload.nextTryAt)
      }
    } finally {
      if (shouldResetCaptcha) {
        captcha.resetCaptcha()
      }

      isLoading.value = false
    }
  }

  const initializeWaitEmailConfirm = async () => {
    const queryEmail = route.query.email
    const queryAttempts = Number(route.query.attempts)
    const nextRequestTimestampMs = Number(route.query.nextRequestTime)

    if (typeof queryEmail !== 'string') {
      await router.push(ROUTE_NAMES.authRegistration)
      return
    }

    email.value = queryEmail
    attempts.value = Number.isNaN(queryAttempts) ? 0 : queryAttempts

    if (nextRequestTimestampMs) {
      syncCounterValue(nextRequestTimestampMs)
    }
  }

  return {
    attempts,
    captcha,
    counterValue,
    email,
    initializeWaitEmailConfirm,
    isLoading,
    resend
  }
}
