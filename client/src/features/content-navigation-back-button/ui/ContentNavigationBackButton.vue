<script setup lang="ts">
import { NmorphButton, NmorphCard, NmorphIcon, NmorphIconBack } from '@nmorph/nmorph-ui-kit'

import { CONTENT_NAVIGATION_BACK_BUTTON_I18N } from '../config/constants'
import { useContentNavigationBackButton } from '../model/use-content-navigation-back-button.model'

const { navigateToContentNavigation } = useContentNavigationBackButton()
</script>

<template>
  <NmorphCard shadow-type="inset" content-class="content-navigation-back-button">
    <NmorphButton :aria-label="$t(CONTENT_NAVIGATION_BACK_BUTTON_I18N.back)" @click="navigateToContentNavigation">
      <NmorphIcon width="16px">
        <NmorphIconBack />
      </NmorphIcon>
    </NmorphButton>
  </NmorphCard>
</template>

<style lang="scss">
.content-navigation-back-button {
  display: flex;
  align-items: center;
}
</style>
