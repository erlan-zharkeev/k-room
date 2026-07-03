<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphDivider, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_PAGE_FAQ_I18N } from '../../config/i18n/faq.i18n'
import { useFaq } from '../../model/faq/use-faq.model'
import SettingsCard from '../SettingsCard.vue'

const { appVersion, contactSupport, filteredItems, openGuide, searchQuery, visibleItems } = useFaq()
</script>

<template>
  <div class="settings-faq-content settings-content-grid">
    <SettingsCard :title="$t(SETTINGS_PAGE_FAQ_I18N.faq)">
      <NmorphTextInput v-model.trim="searchQuery" clearable :placeholder="$t(SETTINGS_PAGE_FAQ_I18N.faqSearch)" />

      <div v-if="filteredItems.length">
        <div v-for="item in visibleItems" :key="item.id" class="settings-faq-content__item">
          <NmorphText class="settings-faq-content__question" as="p" color="var(--nmorph-contrast-text-color)">{{
            item.question
          }}</NmorphText>
          <NmorphText class="settings-faq-content__answer" as="p">{{ item.answer }}</NmorphText>
          <NmorphDivider class="settings-faq-content__list-divider" />
        </div>
      </div>

      <NmorphText v-else>{{ $t(SETTINGS_PAGE_FAQ_I18N.faqNoResults) }}</NmorphText>

      <div class="settings-faq-content__actions">
        <NmorphButton :text="$t(SETTINGS_PAGE_FAQ_I18N.faqOpenGuide)" @click="openGuide" />
        <NmorphButton :text="$t(SETTINGS_PAGE_FAQ_I18N.faqContactSupport)" @click="contactSupport" />
        <NmorphText class="settings-faq-content__version" color="semi-contrast">{{ `v${appVersion}` }}</NmorphText>
      </div>
    </SettingsCard>
  </div>
</template>

<style lang="scss" scoped>
.settings-faq-content__item {
  content-visibility: auto;
  contain-intrinsic-size: 112px;

  display: grid;
  gap: 4px;

  min-width: 0;
  padding: 12px;
  border-radius: 6px;
}

.settings-faq-content__question,
.settings-faq-content__answer {
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
}

.settings-faq-content__list-divider {
  margin-top: 8px;
}

.settings-faq-content__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.settings-faq-content__version {
  margin-left: auto;
}
</style>
