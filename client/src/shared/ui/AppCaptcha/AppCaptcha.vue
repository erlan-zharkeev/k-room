<script setup lang="ts">
import { toRef } from 'vue'

import { AppText } from 'src/shared/ui'

import { APP_CAPTCHA_DEFAULT_PROPS } from './constants'
import { APP_CAPTCHA_I18N } from './i18n'
import type { AppCaptchaProps } from './types'
import { useAppCaptcha } from './use-app-captcha.model'

const props = withDefaults(defineProps<AppCaptchaProps>(), APP_CAPTCHA_DEFAULT_PROPS)
const model = defineModel<string>({ default: '' })

const { containerRef, showUnavailable } = useAppCaptcha({
  action: props.action,
  model,
  resetKey: toRef(props, 'resetKey')
})
</script>

<template>
  <div class="app-captcha">
    <AppText v-if="showUnavailable" color="warn" :text="$t(APP_CAPTCHA_I18N.unavailable)" />
    <div v-else ref="containerRef" class="app-captcha__widget" />
  </div>
</template>

<style lang="scss">
.app-captcha {
  display: grid;
  gap: 8px;
}

.app-captcha__widget {
  min-height: 65px;
}
</style>
