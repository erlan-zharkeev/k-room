<script setup lang="ts">
import { AppNavigation } from 'src/features/app-navigation'
</script>

<template>
  <footer class="mobile-footer">
    <AppNavigation footer />
  </footer>
</template>

<style lang="scss">
.mobile-footer {
  display: flex;
  justify-content: center;
}
</style>
