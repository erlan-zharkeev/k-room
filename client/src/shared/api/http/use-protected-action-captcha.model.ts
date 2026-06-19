import {
  isBoolean,
  isNumber,
  isString,
  isUnknownObject,
  type CaptchaTokenPayload,
  type ProtectedActionResponsePayload
} from 'global-shared'
import { computed, ref } from 'vue'

import { isHttpError } from './create-http-error'

const isProtectedActionResponsePayload = (value: unknown): value is ProtectedActionResponsePayload => {
  if (!isUnknownObject(value)) {
    return false
  }

  const action = Reflect.get(value, 'action')
  const reason = Reflect.get(value, 'reason')
  const captchaAvailable = Reflect.get(value, 'captchaAvailable')
  const nextTryAt = Reflect.get(value, 'nextTryAt')

  return (
    isString(action) && isString(reason) && isBoolean(captchaAvailable) && (nextTryAt == null || isNumber(nextTryAt))
  )
}

const getProtectedActionPayload = (error: unknown) => {
  if (!isHttpError(error)) {
    return null
  }

  const payload = error.payload?.payload

  return isProtectedActionResponsePayload(payload) ? payload : null
}

export const useProtectedActionCaptcha = () => {
  const captchaRequired = ref(false)
  const captchaResetKey = ref(0)
  const captchaToken = ref('')
  const captchaAvailable = computed(() => Boolean(__CLIENT_ENV_DATA__.turnstileSiteKey))

  const resetCaptcha = () => {
    captchaToken.value = ''
    captchaResetKey.value += 1
  }

  const buildCaptchaPayload = () => (captchaToken.value ? { captchaToken: captchaToken.value } : {})

  const resetCaptchaByPayload = (payload: CaptchaTokenPayload) => {
    if (payload.captchaToken) {
      resetCaptcha()
    }
  }

  const createProtectedActionPayload = <TPayload extends object>(payload: TPayload) => {
    const requestPayload = {
      ...payload,
      ...buildCaptchaPayload()
    }

    return {
      requestPayload,
      resetCaptchaIfUsed: () => resetCaptchaByPayload(requestPayload)
    }
  }

  const handleProtectedActionError = (error: unknown) => {
    const payload = getProtectedActionPayload(error)

    if (!payload) {
      return null
    }

    captchaRequired.value = payload.reason === 'captcha-required'

    if (captchaRequired.value) {
      resetCaptcha()
    }

    return payload
  }

  return {
    buildCaptchaPayload,
    captchaAvailable,
    captchaRequired,
    captchaResetKey,
    captchaToken,
    createProtectedActionPayload,
    handleProtectedActionError,
    resetCaptcha,
    resetCaptchaByPayload,
    setCaptchaToken: (value: string) => {
      captchaToken.value = value
    }
  }
}
