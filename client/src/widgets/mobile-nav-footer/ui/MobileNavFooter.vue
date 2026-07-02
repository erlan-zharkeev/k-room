<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppNavigation } from 'src/features/app-navigation'
import { OnboardingGuideTarget } from 'src/features/onboarding-guide'
</script>

<template>
  <NmorphCard tag="footer" class="mobile-nav-footer" content-class="mobile-nav-footer__content">
    <OnboardingGuideTarget class="mobile-nav-footer__navigation-guide-target" name="navigation" position="top">
      <AppNavigation footer />
    </OnboardingGuideTarget>
  </NmorphCard>
</template>

<style lang="scss">
.mobile-nav-footer__content {
  display: flex;
  justify-content: center;
}
</style>

<style lang="scss" scoped>
.mobile-nav-footer__navigation-guide-target > :deep(.nmorph-tooltip),
.mobile-nav-footer__navigation-guide-target > :deep(.nmorph-tooltip__content),
.mobile-nav-footer__navigation-guide-target > :deep(.nmorph-tooltip__content > .nmorph-tooltip__trigger),
.mobile-nav-footer__navigation-guide-target > :deep(.nmorph-tooltip > .nmorph-tooltip__content),
.mobile-nav-footer__navigation-guide-target
  > :deep(.nmorph-tooltip > .nmorph-tooltip__content > .nmorph-tooltip__trigger) {
  display: flex;
}
</style>
