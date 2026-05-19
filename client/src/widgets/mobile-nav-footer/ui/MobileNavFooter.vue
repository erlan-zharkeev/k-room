<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppNavigation } from 'src/features/app-navigation'
</script>

<template>
  <NmorphCard tag="footer" class="mobile-nav-footer" content-class="mobile-nav-footer__content">
    <AppNavigation footer />
  </NmorphCard>
</template>

<style lang="scss">
.mobile-nav-footer__content {
  display: flex;
  justify-content: center;
}
</style>
