<script setup lang="ts">
import { Button } from 'primevue'
import { RouterLink } from 'vue-router'

import { AppHeader } from '../AppHeader'
import { AppText } from '../AppText'

import type { IAppContentNavElProps } from './types'

const props = defineProps<IAppContentNavElProps>()
</script>

<template>
  <div class="app-content-nav-el">
    <RouterLink
      :to="props.to"
      custom
      v-slot="{ href, navigate }"
    >
      <Button
        as="a"
        :href="href"
        :pt="{
          root: {
            class: ['app-content-nav-el-btn', { 'app-content-nav-el-btn--active': props.active }]
          }
        }"
        :aria-current="props.active ? 'page' : undefined"
        :aria-label="props.ariaLabel"
        severity="secondary"
        @click="navigate"
      >
        <div class="app-content-nav-el__text">
          <AppHeader tag="h5" truncate :text="props.label" />
          <AppText tag="p" truncate size="small" color="semi-contrast-color" :text="props.description" />
        </div>

        <i class="pi pi-angle-right app-content-nav-el__icon app-text" aria-hidden="true" />
      </Button>
    </RouterLink>
  </div>
</template>

<style lang="scss">
.app-content-nav-el {
  .app-content-nav-el-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    padding: 12px;
  }

  @include screen-tablet-up {
    .app-content-nav-el-btn.p-button-secondary:not(:disabled):hover {
      background: var(--p-button-secondary-hover-background);
    }

    .app-content-nav-el-btn.app-content-nav-el-btn--active {
      background: var(--p-button-secondary-hover-background);
    }

    .app-content-nav-el-btn.app-content-nav-el-btn--active:not(:disabled):hover {
      background: var(--p-button-secondary-hover-background);
    }
  }
}
</style>
