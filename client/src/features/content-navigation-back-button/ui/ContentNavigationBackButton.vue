<script setup lang="ts">
import { NmorphButton, NmorphIconBack } from '@nmorph/nmorph-ui-kit'

import { CONTENT_NAVIGATION_BACK_BUTTON_I18N } from '../config/constants'
import { useContentNavigationBackButton } from '../model/use-content-navigation-back-button.model'

const { navigateToContentNavigation } = useContentNavigationBackButton()
</script>

<template>
  <NmorphButton
    height="thick"
    :aria-label="$t(CONTENT_NAVIGATION_BACK_BUTTON_I18N.back)"
    @click="navigateToContentNavigation"
  >
    <template #icon>
      <NmorphIconBack />
    </template>
  </NmorphButton>
</template>
