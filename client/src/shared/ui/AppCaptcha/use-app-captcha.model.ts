import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

import { loadTurnstile } from './load-turnstile'
import type { UseAppCaptchaParams } from './types'

export const useAppCaptcha = ({ action, model, resetKey }: UseAppCaptchaParams) => {
  const containerRef = useTemplateRef<HTMLElement>('containerRef')
  const widgetId = ref('')
  const widgetFailed = ref(false)
  const showUnavailable = computed(() => !__CLIENT_ENV_DATA__.turnstileSiteKey || widgetFailed.value)

  const resetWidget = () => {
    if (!window.turnstile || !widgetId.value) {
      model.value = ''
      return
    }

    model.value = ''
    window.turnstile.reset(widgetId.value)
  }

  const renderWidget = async () => {
    if (!__CLIENT_ENV_DATA__.turnstileSiteKey || !containerRef.value) {
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
      sitekey: __CLIENT_ENV_DATA__.turnstileSiteKey,
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
