<script setup lang="ts">
import { AppLogo } from 'src/shared/ui'

import MainNavBar from '../../main-nav-bar/ui/MainNavBar.vue'
</script>

<template>
  <aside class="main-left-bar">
    <AppLogo />
    <MainNavBar />
  </aside>
</template>

<style lang="scss">
.main-left-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
