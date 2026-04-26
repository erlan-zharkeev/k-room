<script setup lang="ts">
import { computed } from 'vue'

import { APP_ICON_DEFAULT_PROPS } from './constants'
import { APP_ICON_MAP } from './icons'
import type { IAppIconProps } from './types'

const props = withDefaults(defineProps<IAppIconProps>(), APP_ICON_DEFAULT_PROPS)

const icon = computed(() => APP_ICON_MAP[props.name])
</script>

<template>
  <span class="app-icon" :class="`app-icon--${props.size}`" aria-hidden="true" v-html="icon" />
</template>

<style>
.app-icon {
  display: inline-grid;
  place-items: center;
  line-height: 0;
  color: currentcolor;
}

.app-icon :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.app-icon--xxs {
  width: 16px;
  height: 16px;
}

.app-icon--xs {
  width: 20px;
  height: 20px;
}

.app-icon--small {
  width: 24px;
  height: 24px;
}

.app-icon--medium {
  width: 30px;
  height: 30px;
}

.app-icon--large {
  width: 36px;
  height: 36px;
}

.app-icon--fill {
  width: 100%;
  height: 100%;
}
</style>
