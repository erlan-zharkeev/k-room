<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppNavigation } from 'src/features/app-navigation'
</script>

<template>
  <NmorphCard tag="footer" class="mobile-footer">
    <AppNavigation footer />
  </NmorphCard>
</template>

<style lang="scss">
.mobile-footer {
  .nmorph-card__content {
    display: flex;
    justify-content: center;
  }
}
</style>
