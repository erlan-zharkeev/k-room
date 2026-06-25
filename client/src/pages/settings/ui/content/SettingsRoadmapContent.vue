<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_PAGE_ROADMAP_I18N } from '../../config/i18n/roadmap.i18n'
import { useRoadmap } from '../../model/use-roadmap.model'
import SettingsCard from '../SettingsCard.vue'

const { roadmapItems } = useRoadmap()
</script>

<template>
  <div class="settings-roadmap-content settings-content-grid">
    <SettingsCard :title="$t(SETTINGS_PAGE_ROADMAP_I18N.roadmap)">
      <NmorphText class="settings-roadmap-content__intro" as="p" color="semi-contrast">{{
        $t(SETTINGS_PAGE_ROADMAP_I18N.intro)
      }}</NmorphText>

      <div class="settings-roadmap-content__list">
        <article v-for="(item, index) in roadmapItems" :key="item.id" class="settings-roadmap-content__item">
          <div class="settings-roadmap-content__item-header">
            <span class="settings-roadmap-content__item-number">{{ index + 1 }}</span>
            <NmorphText
              class="settings-roadmap-content__item-title"
              as="span"
              color="var(--nmorph-contrast-text-color)"
              weight="bold"
              >{{ item.title }}</NmorphText
            >
            <NmorphText as="span" class="settings-roadmap-content__item-status" color="accent" weight="bold">{{
              item.statusText
            }}</NmorphText>
          </div>

          <NmorphText class="settings-roadmap-content__item-description" as="p" color="semi-contrast">{{
            item.description
          }}</NmorphText>
        </article>
      </div>
    </SettingsCard>
  </div>
</template>

<style lang="scss">
.settings-roadmap-content__list {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.settings-roadmap-content__item {
  display: grid;
  gap: 6px;

  min-width: 0;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--nmorph-border-color) 70%, transparent);
  border-radius: 8px;
}

.settings-roadmap-content__item-header {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;

  min-width: 0;
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

.settings-roadmap-content__intro,
.settings-roadmap-content__item-title,
.settings-roadmap-content__item-description {
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
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
