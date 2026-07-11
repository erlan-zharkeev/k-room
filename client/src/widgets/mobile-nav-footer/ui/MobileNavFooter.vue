<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { AppNavigation } from 'src/features/app-navigation'
import { ContentNavigationBackButton } from 'src/features/content-navigation-back-button'
import { OnboardingGuideTarget } from 'src/features/onboarding-guide'

import type { MobileNavFooterProps } from './types'

const props = withDefaults(defineProps<MobileNavFooterProps>(), {
  showBack: false
})
</script>

<template>
  <NmorphCard tag="footer" class="mobile-nav-footer" content-class="mobile-nav-footer__content">
    <OnboardingGuideTarget class="mobile-nav-footer__navigation-guide-target" name="navigation" position="top">
      <AppNavigation footer>
        <template #prepend>
          <ContentNavigationBackButton v-if="props.showBack" class="mobile-nav-footer__back" />
        </template>
      </AppNavigation>
    </OnboardingGuideTarget>
  </NmorphCard>
</template>

<style lang="scss" scoped>
.mobile-nav-footer :deep(.mobile-nav-footer__content) {
  display: flex;
  justify-content: center;
}

.mobile-nav-footer__back.content-navigation-back-button {
  width: var(--basic-component);
  height: var(--basic-component);
  min-height: var(--basic-component);
  padding: 0;
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
