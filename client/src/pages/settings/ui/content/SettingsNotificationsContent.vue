<script setup lang="ts">
import { NmorphSwitch } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { useNotificationSettings } from '../../model/notifications/use-notification-settings.model'
import SettingsCard from '../SettingsCard.vue'

const { sections, optionsBySection, getValue, setValue } = useNotificationSettings()
</script>

<template>
  <div class="settings-notifications-content settings-content-grid settings-content-grid--compact-cards">
    <SettingsCard v-for="section in sections" :key="section.id" :title="$t(section.title)">
      <div class="settings-notifications-content__group">
        <template v-for="option in optionsBySection[section.id]" :key="option.id">
          <div class="settings-notifications-content__row">
            <span class="settings-notifications-content__text">
              <AppText color="contrast-text" :selectable="false" :text="$t(option.label)" />
              <AppText size="small" :selectable="false" :text="$t(option.description)" />
            </span>

            <NmorphSwitch
              :aria-label="$t(option.label)"
              :model-value="getValue(section.id, option.id)"
              @update:model-value="setValue(section.id, option.id, Boolean($event))"
            />
          </div>
        </template>
      </div>
    </SettingsCard>
  </div>
</template>

<style lang="scss">
.settings-notifications-content__group {
  display: grid;
  gap: 8px;
}

.settings-notifications-content__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.settings-notifications-content__text {
  display: grid;
}
</style>
