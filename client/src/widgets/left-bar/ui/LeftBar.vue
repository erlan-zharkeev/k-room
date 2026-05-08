<script setup lang="ts">
import { AppNavigation } from 'src/features/app-navigation'
import { AppLogo } from 'src/shared/ui'
</script>

<template>
  <aside class="left-bar">
    <AppLogo />
    <AppNavigation />
  </aside>
</template>

<style lang="scss">
.left-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
