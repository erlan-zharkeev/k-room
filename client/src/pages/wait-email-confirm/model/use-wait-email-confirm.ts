import { AUTH_ENDPOINTS, ROUTE_NAMES, type ISendConfirmationLinkResponse } from 'global-shared'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useApi } from 'src/shared/api'
import { buildPathWithParams, getNextReqInterval, log } from 'src/shared/lib'

import { WAIT_EMAIL_CONFIRM_COUNTER_TICK_MS } from '../config/constants'

const getCounterValue = (nextRequestTime: number) => Math.max(0, Math.round(getNextReqInterval(nextRequestTime)))

export const useWaitEmailConfirm = () => {
  const route = useRoute()
  const router = useRouter()
  const { doRequest } = useApi()
  const email = ref('')
  const attempts = ref(0)
  const counterValue = ref(0)
  const isLoading = ref(false)
  let counterInterval: ReturnType<typeof setInterval> | undefined

  const isResendDisabled = computed(() => isLoading.value || attempts.value <= 0 || counterValue.value > 0)

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
    }, WAIT_EMAIL_CONFIRM_COUNTER_TICK_MS)
  }

  const syncQuery = async (payload: ISendConfirmationLinkResponse) => {
    await router.replace(buildPathWithParams(ROUTE_NAMES.waitEmailConfirm, payload))
  }

  const resend = async () => {
    if (!email.value) return

    isLoading.value = true

    try {
      const response = await doRequest<ISendConfirmationLinkResponse>(
        'post',
        AUTH_ENDPOINTS.sendEmailConfirmationLink,
        { email: email.value }
      )
      const payload = response.data.payload

      attempts.value = payload.attempts
      counterValue.value = getCounterValue(payload.nextRequestTime)
      await syncQuery(payload)
      startCounter()
    } catch (error) {
      log('error', 'Send email confirmation link failed', error)
    } finally {
      isLoading.value = false
    }
  }

  const initializeWaitEmailConfirm = async () => {
    const queryEmail = route.query.email
    const queryAttempts = Number(route.query.attempts)
    const nextRequestTime = Number(route.query.nextRequestTime)

    if (typeof queryEmail !== 'string') {
      await router.push(ROUTE_NAMES.registration)
      return
    }

    email.value = queryEmail
    attempts.value = Number.isNaN(queryAttempts) ? 0 : queryAttempts

    if (nextRequestTime) {
      counterValue.value = getCounterValue(nextRequestTime)
      startCounter()
    }
  }

  onBeforeUnmount(stopCounter)

  return {
    attempts,
    counterValue,
    email,
    initializeWaitEmailConfirm,
    isLoading,
    isResendDisabled,
    resend
  }
}
