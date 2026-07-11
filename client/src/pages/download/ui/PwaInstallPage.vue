<script setup lang="ts">
import { NmorphCard, NmorphText } from '@nmorph/nmorph-ui-kit'

import { PageBackButton } from 'src/features/page-back-button'

import { DOWNLOAD_PAGE_I18N } from '../config/i18n'

import PwaInstallGuide from './PwaInstallGuide.vue'

const props = defineProps<{
  platform: 'android' | 'ios'
}>()
const { appName } = __CLIENT_ENV_DATA__
</script>

<template>
  <div class="pwa-install-page">
    <NmorphCard
      class="pwa-install-page__card"
      content-class="pwa-install-page__content"
      :card-padding="24"
      shadow-type="inset"
    >
      <PageBackButton />

      <header class="pwa-install-page__header">
        <NmorphText as="h1" align="center" variant="title" weight="bold">{{
          $t(
            props.platform === 'android'
              ? DOWNLOAD_PAGE_I18N.pwaAndroidInstallTitle
              : DOWNLOAD_PAGE_I18N.pwaIosInstallTitle,
            { appName }
          )
        }}</NmorphText>
      </header>

      <NmorphText as="p" color="semi-contrast">{{
        $t(
          props.platform === 'android' ? DOWNLOAD_PAGE_I18N.pwaAndroidInstallHelp : DOWNLOAD_PAGE_I18N.pwaIosInstallHelp
        )
      }}</NmorphText>

      <PwaInstallGuide :platform="props.platform" />
    </NmorphCard>
  </div>
</template>

<style lang="scss" scoped>
.pwa-install-page {
  display: grid;
  place-items: center;
  height: 100%;
}

.pwa-install-page__card {
  width: 100%;
  min-width: 0;
  max-width: var(--app-card-basic-width);
}

.pwa-install-page__content,
.pwa-install-page__header {
  display: grid;
  gap: 16px;
}
</style>
