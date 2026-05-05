<script setup lang="ts">
import { computed } from 'vue'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { APP_TEXT_COLOR_MODIFIERS, APP_TEXT_DEFAULT_PROPS } from './constants'
import type { IAppTextProps } from './types'

const props = withDefaults(defineProps<IAppTextProps>(), APP_TEXT_DEFAULT_PROPS)

const className = computed(() =>
  createClassNameWithModifiers({
    rootClass: 'app-text',
    modifiers: [
      APP_TEXT_COLOR_MODIFIERS[props.color],
      props.align,
      props.bold && 'bold',
      props.truncate && 'truncate',
      props.noLineHeight && 'no-line-height'
    ]
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
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-text--no-line-height {
  line-height: 0;
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
