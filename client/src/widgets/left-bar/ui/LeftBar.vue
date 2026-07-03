<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppNavigation } from 'src/features/app-navigation'
import { OnboardingGuideTarget } from 'src/features/onboarding-guide'
import { AppLogo } from 'src/shared/ui'
</script>

<template>
  <NmorphCard tag="aside" class="left-bar" content-class="left-bar__content">
    <AppLogo />
    <OnboardingGuideTarget class="left-bar__navigation-guide-target" name="navigation">
      <AppNavigation />
    </OnboardingGuideTarget>
  </NmorphCard>
</template>

<style lang="scss" scoped>
.left-bar :deep(.left-bar__content) {
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss" scoped>
.left-bar__navigation-guide-target.nmorph-guide-step,
.left-bar__navigation-guide-target.nmorph-tooltip {
  display: block;
  margin-block: auto;
}

.left-bar__navigation-guide-target > :deep(.nmorph-tooltip),
.left-bar__navigation-guide-target > :deep(.nmorph-tooltip__content),
.left-bar__navigation-guide-target > :deep(.nmorph-tooltip__content > .nmorph-tooltip__trigger),
.left-bar__navigation-guide-target > :deep(.nmorph-tooltip > .nmorph-tooltip__content),
.left-bar__navigation-guide-target > :deep(.nmorph-tooltip > .nmorph-tooltip__content > .nmorph-tooltip__trigger) {
  display: flex;
}
</style>
