import { PROTECTED_ACTION_REASON, isUnknownObject, type IProtectedActionResponsePayload } from 'global-shared'
import { isBoolean, isNumber, isString } from 'lodash'
import { computed, ref } from 'vue'

import { CLIENT_ENV } from 'src/shared/config'

import { isHttpError } from './create-http-error'

const isProtectedActionResponsePayload = (value: unknown): value is IProtectedActionResponsePayload => {
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
  const captchaAvailable = computed(() => Boolean(CLIENT_ENV.turnstileSiteKey))

  const resetCaptcha = () => {
    captchaToken.value = ''
    captchaResetKey.value += 1
  }

  const handleProtectedActionError = (error: unknown) => {
    const payload = getProtectedActionPayload(error)

    if (!payload) {
      return null
    }

    captchaRequired.value = payload.reason === PROTECTED_ACTION_REASON.captchaRequired

    if (captchaRequired.value) {
      resetCaptcha()
    }

    return payload
  }

  return {
    buildCaptchaPayload: () => (captchaToken.value ? { captchaToken: captchaToken.value } : {}),
    captchaAvailable,
    captchaRequired,
    captchaResetKey,
    captchaToken,
    handleProtectedActionError,
    resetCaptcha,
    setCaptchaToken: (value: string) => {
      captchaToken.value = value
    }
  }
}
