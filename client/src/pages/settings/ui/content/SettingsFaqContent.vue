<script setup lang="ts">
import { Button, InputText } from 'primevue'

import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_FAQ_I18N } from '../../config/i18n/faq'
import { useSettingsFaq } from '../../model/faq/use-settings-faq'
import SettingsCard from '../SettingsCard.vue'

const { searchQuery, filteredItems } = useSettingsFaq()
</script>

<template>
  <div class="settings-faq-content">
    <SettingsCard :title="$t(SETTINGS_PAGE_FAQ_I18N.faq)">
      <InputText v-model.trim="searchQuery" fluid size="small" :placeholder="$t(SETTINGS_PAGE_FAQ_I18N.faqSearch)" />

      <div v-if="filteredItems.length" class="settings-faq-content__list">
        <div v-for="item in filteredItems" :key="item.id" class="settings-faq-content__item">
          <AppText color="contrast-color" :text="$t(item.question)" />
          <AppText :text="$t(item.answer)" />
        </div>
      </div>

      <div v-else class="settings-faq-content__empty">
        <AppText :text="$t(SETTINGS_PAGE_FAQ_I18N.faqNoResults)" />
      </div>

      <Button :label="$t(SETTINGS_PAGE_FAQ_I18N.faqContactSupport)" size="small" type="button" />
    </SettingsCard>
  </div>
</template>

<style lang="scss">
.settings-faq-content__list {
  display: grid;
  gap: 12px;
}

.settings-faq-content__item {
  display: grid;
  gap: 4px;

  padding: 10px 12px;
  border-radius: 6px;

  background: var(--app-content-background);
}
</style>
