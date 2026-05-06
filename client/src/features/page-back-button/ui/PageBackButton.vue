<script setup lang="ts">
import { NmorphButton, NmorphIconArrowLeft } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { PAGE_BACK_BUTTON_I18N } from '../config/i18n'

const route = useRoute()
const router = useRouter()
const fallbackRoute = computed(() => (route.meta.guestOnly ? ROUTE_NAMES.authLogin : ROUTE_NAMES.app))

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.replace(fallbackRoute.value)
}
</script>

<template>
  <NmorphButton
    class="page-back-button"
    :text="$t(PAGE_BACK_BUTTON_I18N.back)"
    style-type="transparent"
    @click="handleBack"
  >
    <template #icon>
      <NmorphIconArrowLeft />
    </template>
  </NmorphButton>
</template>

<style>
.page-back-button {
  justify-self: start;
}
</style>
