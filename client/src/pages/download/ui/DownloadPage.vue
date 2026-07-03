<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphCard } from '@nmorph/nmorph-ui-kit'

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
                <svg
                  v-if="item.platformId === 'windows'"
                  class="download-page__platform-svg"
                  viewBox="0 0 4875 4875"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#0078d4"
                    d="M0 0h2311v2310H0zm2564 0h2311v2310H2564zM0 2564h2311v2311H0zm2564 0h2311v2311H2564"
                  />
                </svg>
                <svg
                  v-else-if="item.platformId === 'macos'"
                  class="download-page__platform-svg download-page__platform-svg--macos"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  />
                </svg>
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

        <div class="download-page__mobile-install-group">
          <NmorphText as="h3" weight="bold">Android</NmorphText>
          <NmorphText as="p" color="semi-contrast">{{ $t(DOWNLOAD_PAGE_I18N.pwaAndroidInstallHelp) }}</NmorphText>
        </div>

        <div class="download-page__mobile-install-group">
          <NmorphText as="h3" weight="bold">iOS</NmorphText>
          <NmorphText as="p" color="semi-contrast">{{ $t(DOWNLOAD_PAGE_I18N.pwaIosInstallHelp) }}</NmorphText>
        </div>

        <NmorphText as="p" color="semi-contrast">{{ $t(DOWNLOAD_PAGE_I18N.pwaAutoInstallNote) }}</NmorphText>
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

.download-page__mobile-install,
.download-page__mobile-install-group {
  display: grid;
  gap: 8px;
}

.download-page__mobile-install {
  padding-top: 12px;
  border-top: 1px solid color-mix(in srgb, var(--nmorph-contrast-text-color), transparent 88%);
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
}

.download-page__platform-svg--macos {
  margin-bottom: 2px;
}
</style>
