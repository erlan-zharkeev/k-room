<script setup lang="ts">
import { computed } from 'vue'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { APP_TEXT_DEFAULT_PROPS } from './constants'
import type { IAppTextProps } from './types'

const props = withDefaults(defineProps<IAppTextProps>(), APP_TEXT_DEFAULT_PROPS)

const className = computed(() =>
  createClassNameWithModifiers({
    rootClass: 'app-text',
    modifiers: [props.color, props.size, props.align]
  })
)
</script>

<template>
  <component :is="props.tag" :class="className">
    <slot />
  </component>
</template>

<style scoped>
span.app-text--extra-small,
p.app-text--extra-small {
  font-size: 11px;
}

span.app-text--small,
p.app-text--small {
  font-size: 12px;
}

span.app-text--medium,
p.app-text--medium {
  font-size: 14px;
}

span.app-text--large,
p.app-text--large {
  font-size: 16px;
}

.app-text {
  margin-top: 0;
  margin-bottom: 0;
  color: var(--p-app-text-muted);
}

.app-text--accent-color {
  color: var(--p-primary-color);
}

.app-text--error-color {
  color: var(--p-app-error);
}

.app-text--warn-color {
  color: var(--p-yellow-500);
}

.app-text--left {
  text-align: left;
}

.app-text--center {
  text-align: center;
}

.app-text--right {
  text-align: right;
}
</style>
