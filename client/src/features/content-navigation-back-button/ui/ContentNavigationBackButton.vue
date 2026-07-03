<script setup lang="ts">
import { NmorphButton, NmorphIconArrowLeft } from '@nmorph/nmorph-ui-kit'

import { CONTENT_NAVIGATION_BACK_BUTTON_I18N } from '../config/i18n'
import { useContentNavigationBackButton } from '../model/use-content-navigation-back-button.model'

const { navigateToContentNavigation } = useContentNavigationBackButton()
</script>

<template>
  <NmorphButton
    :aria-label="$t(CONTENT_NAVIGATION_BACK_BUTTON_I18N.back)"
    @click="navigateToContentNavigation"
    class="content-navigation-back-button nmorph nmorph--shadow-inset"
  >
    <template #icon-only>
      <NmorphIconArrowLeft />
    </template>
  </NmorphButton>
</template>

<style lang="scss" scoped>
.content-navigation-back-button {
  width: 42px;
  height: 64px;
  padding: 8px;
  border-radius: 8px;

  :deep(.nmorph-button__content) {
    height: 100%;
  }
}
</style>
