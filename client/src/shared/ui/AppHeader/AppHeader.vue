<script setup lang="ts">
import { APP_HEADER_DEFAULT_PROPS } from './constants'
import type { AppHeaderProps } from './types'
import { useAppHeader } from './use-app-header.model'

const props = withDefaults(defineProps<AppHeaderProps>(), APP_HEADER_DEFAULT_PROPS)
const { className } = useAppHeader(props)
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

.app-header--text {
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

.app-header--not-selectable {
  user-select: none;
}

.app-header--semi-contrast-text {
  color: var(--nmorph-semi-contrast-text-color);
}

.app-header--contrast-text {
  color: var(--nmorph-contrast-text-color);
}

.app-header--accent {
  color: var(--nmorph-accent-color);
}

.app-header--warn {
  color: var(--nmorph-warn-color);
}

.app-header--left {
  text-align: left;
}

.app-header--center {
  text-align: center;
}

.app-header--right {
  text-align: right;
}
</style>
