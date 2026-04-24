<script setup lang="ts">
import { CLIENT_ENV } from 'src/shared/config'

import { LEGAL_INFO_PAGE_I18N } from '../config/i18n'

import DocumentLayout from './DocumentLayout/DocumentLayout.vue'
</script>

<template>
  <DocumentLayout :back-label="$t(LEGAL_INFO_PAGE_I18N.back)">
    <h1>{{ $t(LEGAL_INFO_PAGE_I18N.title)(CLIENT_ENV.appName) }}</h1>

    <p>
      <strong>{{ $t(LEGAL_INFO_PAGE_I18N.lastUpdatedLabel) }}</strong>
      June 1, 2026
    </p>

    <p>{{ $t(LEGAL_INFO_PAGE_I18N.intro)(CLIENT_ENV.appName) }}</p>

    <p>
      <strong>{{ $t(LEGAL_INFO_PAGE_I18N.warning) }}</strong>
      {{ $t(LEGAL_INFO_PAGE_I18N.warningText)(CLIENT_ENV.appName) }}
    </p>

    <p>{{ $t(LEGAL_INFO_PAGE_I18N.storageRisk) }}</p>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section1Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section1Intro) }}</p>
      <ul>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.accountData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.profileData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.communicationData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.technicalData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.diagnosticsData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.thirdPartyData) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.mediaPermissionData) }}</li>
      </ul>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section2Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section2Text) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section3Title) }}</h2>
      <ul>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useAccounts) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useAuth) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useFeatures) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useTransactional) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useDiagnostics) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useProtection) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.useImprove) }}</li>
      </ul>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section4Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.discloseIntro) }}</p>
      <ul>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseProviders) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseUsers) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseLegal) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseBusiness) }}</li>
      </ul>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.discloseNote) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section5Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section5Text) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section6Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section6Text1) }}</p>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section6Text2) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section7Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section7Text) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section8Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section8Text) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section9Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section9Text)(CLIENT_ENV.appName) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section10Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section10Text) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section11Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section11Text) }}</p>
    </section>

    <section>
      <h2>{{ $t(LEGAL_INFO_PAGE_I18N.section12Title) }}</h2>
      <p>{{ $t(LEGAL_INFO_PAGE_I18N.section12Text) }}</p>
    </section>
  </DocumentLayout>
</template>
