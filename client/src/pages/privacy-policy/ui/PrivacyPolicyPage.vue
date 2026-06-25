<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

import { LEGAL_INFO_PAGE_I18N } from '../config/i18n'

const { appName } = __CLIENT_ENV_DATA__
</script>

<template>
  <div class="privacy-policy-page">
    <NmorphText as="h1" color="var(--nmorph-contrast-text-color)" variant="display-medium" weight="bold">{{
      $t(LEGAL_INFO_PAGE_I18N.title, { appName: appName })
    }}</NmorphText>

    <NmorphText as="p" color="semi-contrast">
      <NmorphText color="var(--nmorph-contrast-text-color)" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.lastUpdatedLabel)
      }}</NmorphText>
      June 20, 2026
    </NmorphText>

    <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.intro, { appName: appName }) }}</NmorphText>

    <NmorphText as="p" color="semi-contrast">
      <NmorphText color="var(--nmorph-contrast-text-color)" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.warning)
      }}</NmorphText>
      {{ $t(LEGAL_INFO_PAGE_I18N.warningText, { appName: appName }) }}
    </NmorphText>

    <NmorphText as="p" color="semi-contrast">{{
      $t(LEGAL_INFO_PAGE_I18N.demoProjectNotice, { appName: appName })
    }}</NmorphText>

    <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.storageRisk) }}</NmorphText>

    <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.noConfidentialCommunications) }}</NmorphText>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section1Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section1Intro) }}</NmorphText>
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
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section2Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section2Text) }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section3Title)
      }}</NmorphText>
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
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section4Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.discloseIntro) }}</NmorphText>
      <ul>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseProviders) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseUsers) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseLegal) }}</li>
        <li>{{ $t(LEGAL_INFO_PAGE_I18N.discloseBusiness) }}</li>
      </ul>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.discloseNote) }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section5Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section5Text) }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section6Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section6Text1) }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section6Text2) }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section6Text3) }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section7Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section7Text) }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section8Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section8Text) }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section9Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{
        $t(LEGAL_INFO_PAGE_I18N.section9Text, { appName: appName })
      }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section10Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section10Text) }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section11Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section11Text) }}</NmorphText>
    </section>

    <section>
      <NmorphText as="h2" color="var(--nmorph-contrast-text-color)" variant="title-large" weight="bold">{{
        $t(LEGAL_INFO_PAGE_I18N.section12Title)
      }}</NmorphText>
      <NmorphText as="p" color="semi-contrast">{{ $t(LEGAL_INFO_PAGE_I18N.section12Text) }}</NmorphText>
    </section>
  </div>
</template>
