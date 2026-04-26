<script setup lang="ts">
import { CLIENT_ENV } from 'src/shared/config'
import { AppHeader, AppText } from 'src/shared/ui'

import { LEGAL_INFO_PAGE_I18N } from '../config/i18n'
</script>

<template>
  <div class="privacy-policy-page">
    <AppHeader tag="h1" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.title)(CLIENT_ENV.appName)" />

    <AppText class="privacy-policy-page__meta" tag="p" color="semi-contrast-color">
      <AppText bold color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.lastUpdatedLabel)" />
      June 1, 2026
    </AppText>

    <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.intro)(CLIENT_ENV.appName)" />

    <AppText class="privacy-policy-page__warning" tag="p" color="semi-contrast-color">
      <AppText bold color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.warning)" />
      {{ $t(LEGAL_INFO_PAGE_I18N.warningText)(CLIENT_ENV.appName) }}
    </AppText>

    <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.storageRisk)" />

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section1Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section1Intro)" />
      <ul class="privacy-policy-page__list">
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.accountData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.profileData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.communicationData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.technicalData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.diagnosticsData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.thirdPartyData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.mediaPermissionData) }}</li>
      </ul>
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section2Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section2Text)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section3Title)" />
      <ul class="privacy-policy-page__list">
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useAccounts) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useAuth) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useFeatures) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useTransactional) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useDiagnostics) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useProtection) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useImprove) }}</li>
      </ul>
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section4Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.discloseIntro)" />
      <ul class="privacy-policy-page__list">
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseProviders) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseUsers) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseLegal) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseBusiness) }}</li>
      </ul>
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.discloseNote)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section5Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section5Text)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section6Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section6Text1)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section6Text2)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section7Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section7Text)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section8Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section8Text)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section9Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section9Text)(CLIENT_ENV.appName)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section10Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section10Text)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section11Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section11Text)" />
    </section>

    <section class="privacy-policy-page__section">
      <AppHeader tag="h2" color="contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section12Title)" />
      <AppText tag="p" color="semi-contrast-color" :text="$t(LEGAL_INFO_PAGE_I18N.section12Text)" />
    </section>
  </div>
</template>

<style>
.privacy-policy-page,
.privacy-policy-page__section {
  display: grid;
  gap: 12px;
}

.privacy-policy-page {
  gap: 24px;
}

.privacy-policy-page__list {
  display: grid;
  gap: 8px;

  margin: 0;
  padding-left: 20px;

  color: var(--p-app-text-semi-contrast);
}
</style>
