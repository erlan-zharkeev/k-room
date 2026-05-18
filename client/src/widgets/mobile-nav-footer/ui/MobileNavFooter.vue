<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppNavigation } from 'src/features/app-navigation'
</script>

<template>
  <NmorphCard tag="footer" class="mobile-nav-footer">
    <AppNavigation footer />
  </NmorphCard>
</template>

<style lang="scss">
.mobile-nav-footer {
  .nmorph-card__content {
    display: flex;
    justify-content: center;
  }
}
</style>
