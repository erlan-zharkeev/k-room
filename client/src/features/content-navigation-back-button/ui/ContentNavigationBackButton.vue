<script setup lang="ts">
import { NmorphButton, NmorphCard, NmorphIconBack } from '@nmorph/nmorph-ui-kit'

import { CONTENT_NAVIGATION_BACK_BUTTON_I18N } from '../config/constants'
import { useContentNavigationBackButton } from '../model/use-content-navigation-back-button.model'

const { navigateToContentNavigation } = useContentNavigationBackButton()
</script>

<template>
  <NmorphCard shadow-type="inset" :fill="false" class="content-navigation-back-button">
    <NmorphButton :aria-label="$t(CONTENT_NAVIGATION_BACK_BUTTON_I18N.back)" @click="navigateToContentNavigation">
      <template #icon>
        <NmorphIconBack />
      </template>
    </NmorphButton>
  </NmorphCard>
</template>
