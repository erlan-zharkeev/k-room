import { useIntervalFn } from '@vueuse/core'
import {
  AUTH_ENDPOINTS,
  ROUTE_NAMES,
  type ISendConfirmationLinkPayload,
  type ISendConfirmationLinkResponse
} from 'global-shared'
import { onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useApi, useProtectedActionCaptcha } from 'src/shared/api'
import { buildPathWithParams, getNextRequestIntervalSeconds } from 'src/shared/lib'

import { WAIT_EMAIL_CONFIRM_COUNTER_TICK_MS } from '../config/constants'

const getCounterValue = (nextRequestTimestampMs: number) =>
  Math.max(0, Math.round(getNextRequestIntervalSeconds(nextRequestTimestampMs)))

export const useWaitEmailConfirm = () => {
  const route = useRoute()
  const router = useRouter()
  const { doRequest } = useApi()
  const email = ref('')
  const attempts = ref(0)
  const counterValue = ref(0)
  const isLoading = ref(false)
  const captcha = useProtectedActionCaptcha()

  const { pause: pauseCounter, resume: resumeCounter } = useIntervalFn(
    () => {
      counterValue.value = Math.max(counterValue.value - 1, 0)

      if (counterValue.value <= 0) {
        pauseCounter()
      }
    },
    WAIT_EMAIL_CONFIRM_COUNTER_TICK_MS,
    { immediate: false, immediateCallback: false }
  )

  const stopCounter = () => pauseCounter()

  const startCounter = () => {
    stopCounter()
    resumeCounter()
  }

  const syncQuery = async (payload: ISendConfirmationLinkResponse) => {
    await router.replace(buildPathWithParams(ROUTE_NAMES.waitEmailConfirm, payload))
  }

  const resend = async () => {
    if (!email.value) return

    isLoading.value = true
    const requestPayload: ISendConfirmationLinkPayload = {
      email: email.value,
      ...captcha.buildCaptchaPayload()
    }
    const shouldResetCaptcha = Boolean(requestPayload.captchaToken)

    try {
      const response = await doRequest<ISendConfirmationLinkResponse>(
        'post',
        AUTH_ENDPOINTS.sendEmailConfirmationLink,
        requestPayload
      )
      const payload = response.data.payload

      attempts.value = payload.attempts
      counterValue.value = getCounterValue(payload.nextRequestTime)
      await syncQuery(payload)
      startCounter()
    } catch (error) {
      const payload = captcha.handleProtectedActionError(error)

      if (payload?.nextTryAt) {
        counterValue.value = getCounterValue(payload.nextTryAt)
        startCounter()
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
      counterValue.value = getCounterValue(nextRequestTimestampMs)
      startCounter()
    }
  }

  onBeforeUnmount(stopCounter)

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
