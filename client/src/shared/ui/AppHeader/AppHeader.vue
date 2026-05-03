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
    modifiers: [color.value, props.bold && 'bold', props.truncate && 'truncate']
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

h5.app-header {
  font-size: 16px;
}

.app-header {
  margin-top: 0;
  margin-bottom: 0;
  color: var(--nmorph-text-color);
}

.app-header--text-color {
  color: var(--nmorph-text-color);
}

.app-header--bold {
  font-weight: bold;
}

.app-header--truncate {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header--semi-contrast-color {
  color: var(--nmorph-semi-contrast-text-color);
}

.app-header--contrast-color {
  color: var(--nmorph-contrast-text-color);
}

.app-header--accent-color {
  color: var(--nmorph-accent-color);
}

.app-header--warn-color {
  color: var(--nmorph-warn-color);
}
</style>
