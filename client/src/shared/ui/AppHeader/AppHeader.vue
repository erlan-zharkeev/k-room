<script setup lang="ts">
import { computed } from 'vue'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { APP_HEADER_DEFAULT_PROPS } from './constants'
import type { IAppHeaderProps } from './types'

const props = withDefaults(defineProps<IAppHeaderProps>(), APP_HEADER_DEFAULT_PROPS)
const color = computed(() => props.color ?? (props.accent ? 'accent-color' : undefined))

const className = computed(() =>
  createClassNameWithModifiers({
    rootClass: 'app-header',
    modifiers: [color.value, props.size, props.bold && 'bold']
  })
)
</script>

<template>
  <component :is="props.tag" :class="className">
    {{ props.text }}
    <slot v-if="props.text === undefined" />
  </component>
</template>

<style>
h1.app-header {
  font-size: 28px;
}

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

.app-header--small {
  font-size: 16px;
}

.app-header--medium {
  font-size: 18px;
}

.app-header--large {
  font-size: 20px;
}

.app-header--xlarge {
  font-size: 24px;
}

.app-header--bold {
  font-weight: bold;
}

.app-header--semi-contrast-color {
  color: var(--p-app-text-semi-contrast);
}

.app-header--contrast-color {
  color: var(--p-app-text-contrast);
}

.app-header--accent-color {
  color: var(--p-primary-color);
}

.app-header--warn-color {
  color: var(--p-yellow-500);
}
</style>
