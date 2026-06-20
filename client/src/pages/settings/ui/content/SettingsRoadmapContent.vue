<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import { SETTINGS_PAGE_ROADMAP_I18N } from '../../config/i18n/roadmap.i18n'
import { useRoadmap } from '../../model/use-roadmap.model'
import SettingsCard from '../SettingsCard.vue'

const { roadmapItems } = useRoadmap()
</script>

<template>
  <div class="settings-roadmap-content settings-content-grid">
    <SettingsCard :title="$t(SETTINGS_PAGE_ROADMAP_I18N.roadmap)">
      <AppText color="semi-contrast-text" :text="$t(SETTINGS_PAGE_ROADMAP_I18N.intro)" />

      <div class="settings-roadmap-content__list">
        <article v-for="(item, index) in roadmapItems" :key="item.id" class="settings-roadmap-content__item">
          <div class="settings-roadmap-content__item-header">
            <span class="settings-roadmap-content__item-number">{{ index + 1 }}</span>
            <AppText tag="span" color="contrast-text" bold :text="item.title" />
            <AppText
              tag="span"
              class="settings-roadmap-content__item-status"
              color="accent"
              bold
              :text="item.statusText"
            />
          </div>

          <AppText tag="p" color="semi-contrast-text" :text="item.description" />
        </article>
      </div>
    </SettingsCard>
  </div>
</template>

<style lang="scss">
.settings-roadmap-content__list {
  display: grid;
  gap: 10px;
}

.settings-roadmap-content__item {
  display: grid;
  gap: 6px;

  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--nmorph-border-color) 70%, transparent);
  border-radius: 8px;
}

.settings-roadmap-content__item-header {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}

.settings-roadmap-content__item-number {
  display: grid;
  place-items: center;

  width: 24px;
  height: 24px;
  border-radius: 50%;

  font-size: 12px;
  font-weight: 700;
  color: var(--nmorph-accent-color);

  background: var(--app-accent-surface-subtle);
}

.settings-roadmap-content__item-status {
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--nmorph-accent-color) 14%, transparent);
}

@include screen-tablet {
  .settings-roadmap-content__item-header {
    grid-template-columns: 24px minmax(0, 1fr);
  }

  .settings-roadmap-content__item-status {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
