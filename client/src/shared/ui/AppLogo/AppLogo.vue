<script setup lang="ts">
import { NmorphIcon } from '@nmorph/nmorph-ui-kit'
import { RouterLink } from 'vue-router'

import AppLogoIcon from './AppLogoIcon.vue'
import type { AppLogoProps } from './types'
import { useAppLogo } from './use-app-logo.model'

const props = withDefaults(defineProps<AppLogoProps>(), {
  inset: false,
  variant: 'monochrome'
})
const { appName } = __CLIENT_ENV_DATA__
const { to } = useAppLogo()
</script>

<template>
  <RouterLink
    :to="to"
    :class="[
      'app-logo',
      {
        'app-logo--inset': props.inset,
        'app-logo--monochrome': props.variant === 'monochrome'
      }
    ]"
    :aria-label="appName"
  >
    <NmorphIcon :width="props.inset ? '32px' : '48px'">
      <AppLogoIcon />
    </NmorphIcon>
  </RouterLink>
</template>

<style lang="scss" scoped>
.app-logo--inset {
  display: flex;

  padding: 8px;
  border-radius: var(--default-border-radius);

  background: var(--nmorph-main-color);
  box-shadow: var(--nmorph-shadow-inset);
}

.app-logo--monochrome {
  --app-logo-petal-dark: var(--app-logo-shade-dark);
  --app-logo-petal-medium: var(--app-logo-shade-medium);
  --app-logo-petal-light: var(--app-logo-shade-light);
}
</style>
