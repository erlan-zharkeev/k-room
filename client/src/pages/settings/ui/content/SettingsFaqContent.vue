<script setup lang="ts">
import { NmorphButton, NmorphDivider, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_FAQ_I18N } from '../../config/i18n/faq.i18n'
import { useFaq } from '../../model/faq/use-faq.model'
import SettingsCard from '../SettingsCard.vue'

const { searchQuery, filteredItems } = useFaq()
</script>

<template>
  <div class="settings-faq-content settings-content-grid">
    <SettingsCard :title="$t(SETTINGS_PAGE_FAQ_I18N.faq)">
      <NmorphTextInput v-model.trim="searchQuery" clearable :placeholder="$t(SETTINGS_PAGE_FAQ_I18N.faqSearch)" />

      <div v-if="filteredItems.length" class="settings-faq-content__list">
        <div v-for="item in filteredItems" :key="item.id" class="settings-faq-content__item">
          <AppText color="contrast-text" :text="$t(item.question)" />
          <AppText :text="$t(item.answer)" />
          <NmorphDivider class="settings-faq-content__list-divider" />
        </div>
      </div>

      <div v-else class="settings-faq-content__empty">
        <AppText :text="$t(SETTINGS_PAGE_FAQ_I18N.faqNoResults)" />
      </div>

      <NmorphButton :text="$t(SETTINGS_PAGE_FAQ_I18N.faqContactSupport)" />
    </SettingsCard>
  </div>
</template>

<style lang="scss">
.settings-faq-content.settings-content-grid {
  grid-template-columns: 1fr;
}

.settings-faq-content__item {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 6px;
}

.settings-faq-content__list-divider {
  margin-top: 8px;
}
</style>
