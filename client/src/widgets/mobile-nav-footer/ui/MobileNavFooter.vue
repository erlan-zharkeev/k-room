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
