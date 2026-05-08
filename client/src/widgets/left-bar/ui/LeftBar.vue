<script setup lang="ts">
import { MainNavigation } from 'src/features/main-navigation'
import { AppLogo } from 'src/shared/ui'
</script>

<template>
  <aside class="left-bar">
    <AppLogo />
    <MainNavigation />
  </aside>
</template>

<style lang="scss">
.left-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
