<script setup lang="ts">
import { isString } from 'global-shared'
import { Button } from 'primevue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { MAIN_PAGE_SETTINGS_ITEMS, getMainPageSettingsPath } from 'src/pages/main'
import { useScreen } from 'src/shared/lib'
import { AppHeader, AppText } from 'src/shared/ui'

const route = useRoute()
const { isMobile } = useScreen()

const selectedSettingsId = computed(() => {
  const { settingsId } = route.params

  return isString(settingsId) && settingsId ? settingsId : MAIN_PAGE_SETTINGS_ITEMS[0].id
})

const getItemRoute = (settingsId: string) => ({
  path: getMainPageSettingsPath(settingsId),
  query: isMobile.value ? { ...route.query, view: 'content' } : route.query
})

const getItemButtonPt = (settingsId: string) => ({
  root: {
    class: [
      'settings-navigation-page__item',
      { 'settings-navigation-page__item--active': selectedSettingsId.value === settingsId }
    ]
  }
})
</script>

<template>
  <nav class="settings-navigation-page">
    <RouterLink
      v-for="item in MAIN_PAGE_SETTINGS_ITEMS"
      :key="item.id"
      :to="getItemRoute(item.id)"
      custom
      v-slot="{ href, navigate }"
    >
      <Button
        as="a"
        :href="href"
        :pt="getItemButtonPt(item.id)"
        :aria-current="selectedSettingsId === item.id ? 'page' : undefined"
        :aria-label="$t(item.label)"
        severity="secondary"
        @click="navigate"
      >
        <div class="settings-navigation-page__item-text">
          <AppHeader tag="h5" truncate :text="$t(item.label)" />
          <AppText tag="p" truncate size="small" color="semi-contrast-color" :text="$t(item.description)" />
        </div>

        <i class="pi pi-angle-right settings-navigation-page__item-icon app-text" aria-hidden="true" />
      </Button>
    </RouterLink>
  </nav>
</template>

<style lang="scss">
.settings-navigation-page {
  display: flex;
  flex-direction: column;

  .settings-navigation-page__item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  margin-bottom: 8px;
  padding: 12px;

  // border: 1px solid var(--p-content-border-color);
  // border-radius: 12px;

  // color: inherit;
  // text-align: left;

  // background: var(--p-app-muted-background);
}

.settings-navigation-page__item:last-child {
  // margin-bottom: 0;
}

.settings-navigation-page__item--active {
  // opacity: .7;
}

.settings-navigation-page__item:active {
  // transform: scale(.99);
}

.settings-navigation-page__item-text {
  // min-width: 0;
}

.settings-navigation-page__item-icon {
  // flex-shrink: 0;
  // margin-left: 12px;
}

}




</style>
