<script setup lang="ts">
import { NmorphButton, NmorphIconArrowLeft } from '@nmorph/nmorph-ui-kit'

import { PAGE_BACK_BUTTON_I18N } from '../config/i18n'
import { usePageBackButton } from '../model/use-page-back-button.model'

const { handleBack } = usePageBackButton()
</script>

<template>
  <NmorphButton
    class="page-back-button"
    :text="$t(PAGE_BACK_BUTTON_I18N.back)"
    design="plain"
    borderless
    @click="handleBack"
  >
    <template #icon>
      <NmorphIconArrowLeft />
    </template>
  </NmorphButton>
</template>

<style scoped>
.page-back-button {
  justify-self: start;
}
</style>
