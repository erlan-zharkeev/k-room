<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphCard } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { RouterLink } from 'vue-router'

import { PageBackButton } from 'src/features/page-back-button'

import { DOWNLOAD_PAGE_I18N } from '../config/i18n'
import { useDownloadPage } from '../model/use-download-page.model'

const { appName } = __CLIENT_ENV_DATA__
const {
  appVersion,
  downloadPlatformItem,
  hasDownloadError,
  hasLoadError,
  isDownloading,
  isLoading,
  isPlatformDownloading,
  loadReleasesManifest,
  platformItems,
  releasedAt,
  showPlatformItems,
  showReleasedAt
} = useDownloadPage()
</script>

<template>
  <div class="download-page">
    <NmorphCard
      class="download-page__card"
      content-class="download-page__card-content"
      :card-padding="24"
      shadow-type="inset"
    >
      <PageBackButton />

      <header class="download-page__header">
        <NmorphText as="h1" align="center" variant="display-medium" weight="bold">{{
          $t(DOWNLOAD_PAGE_I18N.title, { appName: appName })
        }}</NmorphText>
        <NmorphText as="p" align="center" color="semi-contrast">{{ $t(DOWNLOAD_PAGE_I18N.description) }}</NmorphText>
      </header>

      <div class="download-page__meta">
        <NmorphText as="span" align="center" color="var(--nmorph-contrast-text-color)">{{
          `${$t(DOWNLOAD_PAGE_I18N.versionLabel)} ${appVersion}`
        }}</NmorphText>
        <NmorphText v-if="showReleasedAt" as="span" align="center" color="semi-contrast">{{
          `${$t(DOWNLOAD_PAGE_I18N.releasedLabel)} ${releasedAt}`
        }}</NmorphText>
      </div>

      <NmorphText v-if="isLoading" align="center" color="semi-contrast">{{
        $t(DOWNLOAD_PAGE_I18N.loading)
      }}</NmorphText>

      <div v-else-if="hasLoadError" class="download-page__state">
        <NmorphText align="center" color="var(--nmorph-warn-text-color)">{{ $t(DOWNLOAD_PAGE_I18N.error) }}</NmorphText>
        <NmorphButton :text="$t(DOWNLOAD_PAGE_I18N.retry)" @click="loadReleasesManifest" />
      </div>

      <div v-else-if="showPlatformItems" class="download-page__download-area">
        <NmorphText v-if="hasDownloadError" align="center" color="var(--nmorph-warn-text-color)">{{
          $t(DOWNLOAD_PAGE_I18N.downloadUnavailable)
        }}</NmorphText>

        <div class="download-page__actions">
          <NmorphButton
            v-for="item in platformItems"
            fill
            :key="item.platformId"
            thickness="thick"
            class="download-page__download-button"
            :aria-label="$t(DOWNLOAD_PAGE_I18N.downloadAction, { platformLabel: item.label })"
            :disabled="isDownloading"
            :loading="isPlatformDownloading(item.platformId)"
            @click="downloadPlatformItem(item)"
          >
            <span class="download-page__download-button-content">
              <span class="download-page__platform-logo" aria-hidden="true">
                <span
                  v-if="item.platformId === 'windows'"
                  class="download-page__platform-svg download-page__platform-svg--windows"
                />
                <span
                  v-else-if="item.platformId === 'macos'"
                  class="download-page__platform-svg download-page__platform-svg--macos"
                />
              </span>
              <span class="download-page__download-button-text">
                <NmorphText color="var(--nmorph-contrast-text-color)" weight="bold">{{ item.label }}</NmorphText>
              </span>
            </span>
          </NmorphButton>
        </div>

        <div class="download-page__install-help">
          <NmorphText as="p" color="semi-contrast">{{ $t(DOWNLOAD_PAGE_I18N.windowsInstallHelp) }}</NmorphText>
          <NmorphText as="p" color="semi-contrast">{{ $t(DOWNLOAD_PAGE_I18N.macosInstallHelp) }}</NmorphText>
        </div>
      </div>

      <div v-else class="download-page__state">
        <NmorphText align="center" color="var(--nmorph-warn-text-color)">{{
          $t(DOWNLOAD_PAGE_I18N.downloadUnavailable)
        }}</NmorphText>
      </div>

      <section class="download-page__mobile-install">
        <NmorphText as="h2" align="center" variant="title" weight="bold">{{
          $t(DOWNLOAD_PAGE_I18N.pwaInstallTitle, { appName: appName })
        }}</NmorphText>

        <div class="download-page__mobile-install-actions">
          <RouterLink custom :to="ROUTE_NAMES.pwaInstallAndroid" v-slot="{ navigate }">
            <NmorphButton fill text="Android" thickness="thick" @click="navigate" />
          </RouterLink>
          <RouterLink custom :to="ROUTE_NAMES.pwaInstallIos" v-slot="{ navigate }">
            <NmorphButton fill text="iOS / iPadOS" thickness="thick" @click="navigate" />
          </RouterLink>
        </div>
      </section>
    </NmorphCard>
  </div>
</template>

<style lang="scss" scoped>
.download-page {
  display: grid;
  place-items: center;
  height: 100%;
}

.download-page__card {
  width: 100%;
  min-width: 0;
  max-width: var(--app-card-basic-width);
}

.download-page :deep(.download-page__card-content),
.download-page__header,
.download-page__download-area,
.download-page__state {
  display: grid;
  gap: 12px;
}

.download-page__meta {
  display: grid;
}

.download-page__state {
  margin-bottom: 16px;
}

.download-page__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.download-page__install-help {
  display: grid;
  gap: 8px;
}

.download-page__mobile-install {
  display: grid;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid color-mix(in srgb, var(--nmorph-contrast-text-color), transparent 88%);
}

.download-page__mobile-install-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.download-page__download-button-content {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.download-page__platform-svg {
  display: block;

  width: 18px;
  height: 18px;

  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

.download-page__platform-svg--windows {
  background-color: #0078d4;
  mask-image: url('../assets/windows.svg');
}

.download-page__platform-svg--macos {
  margin-bottom: 2px;
  background-color: currentcolor;
  mask-image: url('../assets/macos.svg');
}
</style>
