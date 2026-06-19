<script setup lang="ts">
import { NmorphButton } from '@nmorph/nmorph-ui-kit'

import { CONTENT_NAVIGATION_BACK_BUTTON_I18N } from '../config/i18n'
import { useContentNavigationBackButton } from '../model/use-content-navigation-back-button.model'

const { navigateToContentNavigation } = useContentNavigationBackButton()
</script>

<template>
  <NmorphButton
    design="plain"
    borderless
    color="var(--nmorph-contrast-text-color)"
    :text="$t(CONTENT_NAVIGATION_BACK_BUTTON_I18N.back)"
    :aria-label="$t(CONTENT_NAVIGATION_BACK_BUTTON_I18N.back)"
    @click="navigateToContentNavigation"
  />
</template>
