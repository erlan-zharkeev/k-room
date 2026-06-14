<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppNavigation } from 'src/features/app-navigation'
import { ONBOARDING_GUIDE_STEP, OnboardingGuideTarget } from 'src/features/onboarding-guide'
import { AppLogo } from 'src/shared/ui'
</script>

<template>
  <NmorphCard tag="aside" class="left-bar" content-class="left-bar__content">
    <AppLogo />
    <OnboardingGuideTarget class="left-bar__navigation-guide-target" :name="ONBOARDING_GUIDE_STEP.navigation">
      <AppNavigation />
    </OnboardingGuideTarget>
  </NmorphCard>
</template>

<style lang="scss">
.left-bar__content {
  display: flex;
  flex-direction: column;
}
</style>
