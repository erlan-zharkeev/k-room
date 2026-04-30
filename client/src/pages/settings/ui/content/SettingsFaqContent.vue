<script setup lang="ts">
import { Button, InputText } from 'primevue'
import { computed, ref } from 'vue'

import { useI18n } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

import { FAQ_ITEMS } from '../../config/faq'
import { SETTINGS_PAGE_I18N } from '../../config/i18n'
import SettingsCard from '../SettingsCard.vue'

const { t } = useI18n()
const searchQuery = ref('')

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return FAQ_ITEMS

  return FAQ_ITEMS.filter((item) => {
    const question = t(item.question).toLowerCase()
    const answer = t(item.answer).toLowerCase()

    return question.includes(query) || answer.includes(query)
  })
})
</script>

<template>
  <div class="settings-faq-content">
    <SettingsCard :title="$t(SETTINGS_PAGE_I18N.faq)">
      <InputText
        v-model="searchQuery"
        fluid
        size="small"
        :placeholder="$t(SETTINGS_PAGE_I18N.faqSearch)"
      />

      <div v-if="filteredItems.length" class="settings-faq-content__list">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="settings-faq-content__item"
        >
          <AppText color="contrast-color" :text="$t(item.question)" />
          <AppText :text="$t(item.answer)" />
        </div>
      </div>

      <div v-else class="settings-faq-content__empty">
        <AppText :text="$t(SETTINGS_PAGE_I18N.faqNoResults)" />
      </div>

      <Button
        :label="$t(SETTINGS_PAGE_I18N.faqContactSupport)"
        size="small"
        type="button"
      />
    </SettingsCard>
  </div>
</template>

<style lang="scss">
.settings-faq-content {
  display: grid;
  gap: 12px;
  align-content: start;
}

.settings-faq-content__list {
  display: grid;
  gap: 12px;
}

.settings-faq-content__item {
  display: grid;
  gap: 4px;

  padding: 10px 12px;
  border-radius: 6px;

  background: var(--p-content-background);
}
</style>
