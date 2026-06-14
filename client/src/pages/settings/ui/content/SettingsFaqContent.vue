<script setup lang="ts">
import { NmorphButton, NmorphDivider, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_FAQ_I18N } from '../../config/i18n/faq.i18n'
import { useFaq } from '../../model/faq/use-faq.model'
import SettingsCard from '../SettingsCard.vue'

const { contactSupport, filteredItems, openGuide, searchQuery, supportEmail } = useFaq()
</script>

<template>
  <div class="settings-faq-content settings-content-grid">
    <SettingsCard :title="$t(SETTINGS_PAGE_FAQ_I18N.faq)">
      <NmorphTextInput v-model.trim="searchQuery" clearable :placeholder="$t(SETTINGS_PAGE_FAQ_I18N.faqSearch)" />

      <div v-if="filteredItems.length">
        <div v-for="item in filteredItems" :key="item.id" class="settings-faq-content__item">
          <AppText color="contrast-text" :text="$t(item.question)" />
          <AppText :text="$t(item.answer)" />
          <NmorphDivider class="settings-faq-content__list-divider" />
        </div>
      </div>

      <AppText v-else :text="$t(SETTINGS_PAGE_FAQ_I18N.faqNoResults)" />

      <div class="settings-faq-content__actions">
        <NmorphButton :text="$t(SETTINGS_PAGE_FAQ_I18N.faqOpenGuide)" @click="openGuide" />
        <NmorphButton :text="$t(SETTINGS_PAGE_FAQ_I18N.faqContactSupport)" @click="contactSupport" />
        <AppText :text="supportEmail" />
      </div>
    </SettingsCard>
  </div>
</template>

<style lang="scss">
.settings-faq-content__item {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 6px;
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
</style>
