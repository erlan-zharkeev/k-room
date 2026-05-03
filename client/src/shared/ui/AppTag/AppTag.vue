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

  background: var(--nmorph-gray-color);
}

.app-tag--success {
  background: var(--nmorph-success-color);
}

.app-tag--warn {
  background: var(--nmorph-warn-color);
}

.app-tag--danger {
  background: var(--nmorph-error-color);
}

.app-tag--info {
  background: var(--nmorph-info-color);
}

.app-tag--secondary {
  background: var(--nmorph-placeholder-text-color);
}
</style>
