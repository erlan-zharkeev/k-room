<script setup lang="ts">
import { computed } from 'vue'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { APP_HEADER_DEFAULT_PROPS } from './constants'
import type { IAppHeaderProps } from './types'

const props = withDefaults(defineProps<IAppHeaderProps>(), APP_HEADER_DEFAULT_PROPS)

const className = computed(() =>
  createClassNameWithModifiers({
    rootClass: 'app-header',
    modifiers: [props.accent && 'accent', props.bold && 'bold']
  })
)
</script>

<template>
  <component :is="props.tag" :class="className">
    <slot />
  </component>
</template>

<style scoped>
h2.app-header {
  font-size: 24px;
}

h3.app-header {
  font-size: 20px;
}

h4.app-header {
  font-size: 18px;
}

.app-header {
  margin-top: 0;
  margin-bottom: 0;
  color: var(--p-app-text-muted);
}

.app-header--bold {
  font-weight: bold;
}

.app-header--accent {
  color: var(--p-primary-color);
}
</style>
