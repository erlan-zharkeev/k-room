<script setup lang="ts">
import { computed } from 'vue'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { AppText } from '../AppText'

import type { IAppTagProps } from './types'

const props = withDefaults(defineProps<IAppTagProps>(), { severity: 'secondary' })

const className = computed(() => createClassNameWithModifiers({ rootClass: 'app-tag', modifiers: [props.severity] }))
</script>

<template>
  <span :class="className">
    <AppText tag="small" color="contrast-color">
      <slot>{{ props.value }}</slot>
    </AppText>
  </span>
</template>

<style>
.app-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 2px 6px;
  border-radius: 4px;

  background: var(--p-secondary-color);
}

.app-tag--success {
  background: var(--p-green-600);
}

.app-tag--warn {
  background: var(--p-yellow-600);
}

.app-tag--danger {
  background: var(--p-red-600);
}

.app-tag--info {
  background: var(--p-blue-600);
}

.app-tag--secondary {
  background: var(--p-surface-600);
}
</style>
