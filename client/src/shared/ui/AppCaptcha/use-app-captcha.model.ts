import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { CLIENT_ENV } from 'src/shared/config'

import { loadTurnstile } from './load-turnstile'
import type { IUseAppCaptchaParams } from './types'

export const useAppCaptcha = ({ action, model, resetKey }: IUseAppCaptchaParams) => {
  const containerRef = ref<HTMLElement | null>(null)
  const widgetId = ref('')
  const widgetFailed = ref(false)
  const showUnavailable = computed(() => !CLIENT_ENV.turnstileSiteKey || widgetFailed.value)

  const resetWidget = () => {
    if (!window.turnstile || !widgetId.value) {
      model.value = ''
      return
    }

    model.value = ''
    window.turnstile.reset(widgetId.value)
  }

  const renderWidget = async () => {
    if (!CLIENT_ENV.turnstileSiteKey || !containerRef.value) {
      widgetFailed.value = true
      return
    }

    const turnstile = await loadTurnstile()

    if (!turnstile || !containerRef.value) {
      widgetFailed.value = true
      return
    }

    widgetFailed.value = false

    if (widgetId.value) {
      turnstile.remove(widgetId.value)
    }

    widgetId.value = turnstile.render(containerRef.value, {
      sitekey: CLIENT_ENV.turnstileSiteKey,
      action,
      callback: (token) => {
        model.value = token
      },
      'expired-callback': () => {
        model.value = ''
      },
      'error-callback': () => {
        model.value = ''
      }
    })
  }

  onMounted(renderWidget)

  onBeforeUnmount(() => {
    if (window.turnstile && widgetId.value) {
      window.turnstile.remove(widgetId.value)
    }
  })

  watch(resetKey, resetWidget)

  return {
    containerRef,
    showUnavailable
  }
}
