<script setup lang="ts">
import { APP_TEXT_DEFAULT_PROPS } from './constants'
import type { AppTextProps } from './types'
import { useAppText } from './use-app-text.model'

const props = withDefaults(defineProps<AppTextProps>(), APP_TEXT_DEFAULT_PROPS)
const { className } = useAppText(props)
</script>

<template>
  <component :is="props.tag" :class="className">
    {{ props.text }}
    <slot v-if="props.text === undefined" />
  </component>
</template>

<style>
span.app-text,
p.app-text {
  font-size: 14px;
}

div.app-text {
  font-size: 16px;
}

small.app-text {
  font-size: 12px;
}

.app-text {
  margin-top: 0;
  margin-bottom: 0;
  color: var(--nmorph-text-color);
}

.app-text--text {
  color: var(--nmorph-text-color);
}

.app-text--semi-contrast-text {
  color: var(--nmorph-semi-contrast-text-color);
}

.app-text--contrast-text {
  color: var(--nmorph-contrast-text-color);
}

.app-text--accent {
  color: var(--nmorph-accent-color);
}

.app-text--warn {
  color: var(--nmorph-warn-color);
}

.app-text--error-text {
  color: var(--nmorph-error-text-color);
}

.app-text--bold {
  font-weight: 700;
}

.app-text--truncate {
  overflow: hidden;
  display: block;

  min-width: 0;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-text--no-line-height {
  line-height: 0;
}

.app-text--not-selectable {
  user-select: none;
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
