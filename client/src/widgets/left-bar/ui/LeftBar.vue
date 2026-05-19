<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppNavigation } from 'src/features/app-navigation'
import { AppLogo } from 'src/shared/ui'
</script>

<template>
  <NmorphCard tag="aside" class="left-bar" content-class="left-bar__content">
    <AppLogo />
    <AppNavigation />
  </NmorphCard>
</template>

<style lang="scss">
.left-bar__content {
  display: flex;
  flex-direction: column;
}
</style>
