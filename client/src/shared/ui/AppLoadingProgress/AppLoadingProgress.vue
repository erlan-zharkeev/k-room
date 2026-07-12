<script setup lang="ts">
import { NmorphProgress } from '@nmorph/nmorph-ui-kit'
</script>

<template>
  <NmorphProgress class="app-loading-progress" :percentage="100" :height="4" :value-right-side="false" indeterminate />
</template>

<style scoped>
.app-loading-progress {
  animation: app-loading-progress-glow 1.6s ease-in-out infinite;
}

@keyframes app-loading-progress-glow {
  0%,
  100% {
    opacity: 0.86;
    filter: drop-shadow(0 0 2px color-mix(in srgb, var(--nmorph-accent-color) 42%, transparent));
  }

  50% {
    opacity: 1;
    filter: drop-shadow(0 0 7px color-mix(in srgb, var(--nmorph-accent-color) 78%, transparent));
  }
}
</style>
