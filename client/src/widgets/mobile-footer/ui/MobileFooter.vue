<script setup lang="ts">
import { MainNavigation } from 'src/features/main-navigation'
</script>

<template>
  <footer class="mobile-footer">
    <MainNavigation footer />
  </footer>
</template>

<style lang="scss">
.mobile-footer {
  display: flex;
  justify-content: center;
}
</style>
