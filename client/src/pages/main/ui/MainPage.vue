<script setup lang="ts">
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import {
  MAIN_PAGE_CONTENT_ITEMS,
  MAIN_PAGE_NAV_ITEMS,
  MAIN_PAGE_SIDE_PANEL_ITEMS
} from 'src/pages/main/config/constants'
import { MAIN_PAGE_I18N } from 'src/pages/main/config/i18n'
import { useLogout } from 'src/pages/main/model/use-logout'

const route = useRoute()
const { isLogoutLoading, logout } = useLogout()

const activeNavItem = computed(
  () => MAIN_PAGE_NAV_ITEMS.find(({ path }) => path === route.path) ?? MAIN_PAGE_NAV_ITEMS[0]
)
const activePanelItems = computed(() => MAIN_PAGE_SIDE_PANEL_ITEMS[activeNavItem.value.id])
const activeContentItem = computed(() => MAIN_PAGE_CONTENT_ITEMS[activeNavItem.value.id])
</script>

<template>
  <main class="main-page">
    <aside class="main-page__left-bar">
      <div class="main-page__brand">K</div>

      <nav class="main-page__nav">
        <RouterLink
          v-for="item in MAIN_PAGE_NAV_ITEMS"
          :key="item.id"
          :to="item.path"
          custom
          v-slot="{ href, navigate, isExactActive }"
        >
          <Button
            :href="href"
            :aria-label="$t(item.label)"
            :aria-current="isExactActive ? 'page' : undefined"
            :class="{ 'main-page__nav-button--active': isExactActive }"
            :icon="item.icon"
            as="a"
            rounded
            text
            @click="navigate"
          />
        </RouterLink>
      </nav>

      <Button :aria-label="$t(MAIN_PAGE_I18N.openDevices)" icon="pi pi-volume-up" rounded text />
    </aside>

    <section class="main-page__workspace">
      <header class="main-page__top-bar">
        <div class="main-page__profile">
          <Avatar label="K" shape="circle" />
          <div class="main-page__profile-text">
            <strong>K-Room</strong>
            <span>{{ $t(activeNavItem.label) }}</span>
          </div>
        </div>

        <div class="main-page__top-actions">
          <Badge value="online" severity="success" />
          <Button :aria-label="$t(MAIN_PAGE_I18N.notifications)" icon="pi pi-bell" rounded text />
          <Button
            :aria-label="$t(MAIN_PAGE_I18N.logout)"
            icon="pi pi-sign-out"
            :loading="isLogoutLoading"
            rounded
            text
            @click="logout"
          />
        </div>
      </header>

      <div class="main-page__body">
        <aside class="main-page__side-panel">
          <div class="main-page__panel-header">
            <h2>{{ $t(activeNavItem.label) }}</h2>
            <Button :aria-label="$t(MAIN_PAGE_I18N.add)" icon="pi pi-plus" rounded text />
          </div>

          <InputText class="main-page__search" placeholder="Поиск" />

          <div class="main-page__panel-list">
            <button v-for="item in activePanelItems" :key="item.title" class="main-page__panel-item" type="button">
              <span>{{ item.title }}</span>
              <small>{{ item.detail }}</small>
            </button>
          </div>
        </aside>

        <section class="main-page__content">
          <div class="main-page__content-header">
            <div class="main-page__content-icon">
              <i :class="activeContentItem.icon" />
            </div>
            <div>
              <h1>{{ activeContentItem.title }}</h1>
              <p>{{ activeContentItem.detail }}</p>
            </div>
          </div>

          <div class="main-page__content-surface">
            <div class="main-page__content-line main-page__content-line--short" />
            <div class="main-page__content-line" />
            <div class="main-page__content-line main-page__content-line--medium" />
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
.main-page {
  overflow: hidden;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;

  height: 100dvh;
  padding: 12px;
}

.main-page__left-bar,
.main-page__top-bar,
.main-page__side-panel,
.main-page__content {
  border: 1px solid var(--dark-gray-transparent-2);
  border-radius: 18px;
  background: var(--surface-card);
  box-shadow: 12px 12px 28px var(--shadow-outset-start), -12px -12px 28px var(--shadow-outset-end);
}

.main-page__left-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  min-width: 0;
  padding: 10px 8px;
}

.main-page__brand {
  display: grid;
  place-items: center;

  width: 36px;
  height: 36px;
  border-radius: 50%;

  font-weight: 800;
  color: var(--white);

  background: var(--accent);
}

.main-page__nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.main-page__nav-button--active {
  color: var(--white);
  background: var(--accent);
}

.main-page__workspace {
  display: grid;
  grid-template-rows: 58px minmax(0, 1fr);
  gap: 12px;

  min-width: 0;
  min-height: 0;
}

.main-page__top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-width: 0;
  padding: 8px 12px;
}

.main-page__profile,
.main-page__top-actions,
.main-page__content-header {
  display: flex;
  align-items: center;
}

.main-page__profile {
  gap: 10px;
  min-width: 0;
}

.main-page__profile-text {
  display: grid;
  min-width: 0;
}

.main-page__profile-text strong,
.main-page__profile-text span,
.main-page__panel-item span,
.main-page__panel-item small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-page__profile-text strong {
  font-size: 0.95rem;
}

.main-page__profile-text span,
.main-page__panel-item small,
.main-page__content-header p {
  color: var(--text);
}

.main-page__top-actions {
  gap: 8px;
}

.main-page__body {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 12px;

  min-width: 0;
  min-height: 0;
}

.main-page__side-panel,
.main-page__content {
  overflow: hidden;
  min-height: 0;
}

.main-page__side-panel {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
}

.main-page__panel-header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.main-page__panel-header h2,
.main-page__content-header h1,
.main-page__content-header p {
  margin: 0;
}

.main-page__panel-header h2 {
  font-size: 1rem;
  overflow-wrap: anywhere;
}

.main-page__search {
  width: 100%;
}

.main-page__panel-list {
  overflow: auto;
  display: grid;
  gap: 8px;
  align-content: start;

  min-height: 0;
}

.main-page__panel-item {
  cursor: pointer;

  display: grid;
  gap: 4px;

  width: 100%;
  padding: 12px;
  border: 1px solid var(--dark-gray-transparent-2);
  border-radius: 8px;

  color: var(--contrast-text);
  text-align: left;

  background: var(--dark-gray-transparent);
}

.main-page__panel-item:hover {
  border-color: var(--accent);
}

.main-page__content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  padding: 16px;
}

.main-page__content-header {
  gap: 12px;
}

.main-page__content-icon {
  display: grid;
  place-items: center;

  width: 42px;
  height: 42px;
  border-radius: 50%;

  color: var(--white);

  background: var(--accent);
}

.main-page__content-header h1 {
  font-size: 1.15rem;
  overflow-wrap: anywhere;
}

.main-page__content-surface {
  display: grid;
  gap: 10px;
  align-content: end;

  min-height: 0;
  padding: 12px;
  border: 1px solid var(--dark-gray-transparent-2);
  border-radius: 8px;

  background: var(--dark-gray-transparent);
}

.main-page__content-line {
  width: min(520px, 82%);
  height: 38px;
  border-radius: 8px;
  background: var(--dark-gray-transparent-2);
}

.main-page__content-line--short {
  width: min(280px, 52%);
}

.main-page__content-line--medium {
  width: min(420px, 70%);
}

@media (width <= 820px) {
  .main-page {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) 62px;
  }

  .main-page__left-bar {
    grid-row: 2;
    flex-direction: row;
    padding: 8px 10px;
  }

  .main-page__nav {
    flex-direction: row;
  }

  .main-page__body {
    grid-template-columns: 1fr;
  }

  .main-page__side-panel {
    min-height: 220px;
  }
}
</style>
